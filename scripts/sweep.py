"""Screen sweep: signs in as the manager, opens Suite Home, every department home and every screen in each
department's menu, and checks each one at 1440 and 1024 wide. A problem fails the run (exit code 1).

    python3 scripts/sweep.py                       # app on http://localhost:5173 (pnpm dev)
    python3 scripts/sweep.py --url http://localhost:5199 --out /tmp/sweep

Checks per screen: browser errors, a page wider than the window, form fields without a name, buttons without a name,
and a department that would not open. Also recorded (not failed): text under 12px, forced capitals, clipped text,
click targets under 30px, pictures from the internet, dates in the wrong format. Screenshots go in the output folder.

Needs Python 3 and Playwright: pip install playwright && python3 -m playwright install chromium
"""
import argparse, asyncio, json, os, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
# Department names come from the app's own list, so a new department is swept without editing this file.
DEPTS = re.findall(r'id: "[^"]+", name: "([^"]+)"', (ROOT / "src/app/suite/departments.ts").read_text())
FAIL = ("errors", "hscroll", "inpNoLabel", "btnNoName")

JS = """() => {
 const vw=innerWidth; const main=document.querySelector('main')||document.body; const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
 const texts=[...main.querySelectorAll('*')].filter(e=>vis(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1));
 let tiny=0,upper=0,clipped=0; for(const e of texts){const s=getComputedStyle(e);if(parseFloat(s.fontSize)<12)tiny++;if(s.textTransform==='uppercase')upper++;if(e.scrollWidth>e.clientWidth+2&&s.overflow!=='visible'&&s.textOverflow!=='ellipsis')clipped++;}
 const scrolls=e=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll')return true;}return false;};
 const over=[...main.querySelectorAll('*')].filter(e=>vis(e)&&e.getBoundingClientRect().right>vw+2&&!scrolls(e)).length;
 const unnamedBtn=[...main.querySelectorAll('button')].filter(b=>vis(b)&&!(b.innerText||'').trim()&&!b.getAttribute('aria-label')&&!b.title);
 const unlabelled=[...main.querySelectorAll('input,select,textarea')].filter(i=>vis(i)&&i.type!=='hidden'&&!i.closest('[aria-hidden]')&&!i.getAttribute('aria-label')&&!i.closest('label')&&!(i.id&&document.querySelector('label[for="'+i.id+'"]')));
 const remote=[...document.querySelectorAll('img')].filter(i=>/^https?:/.test(i.getAttribute('src')||'')&&!i.src.includes('localhost')).length;
 const small=[...main.querySelectorAll('button,a,[role=button]')].filter(b=>vis(b)&&b.getBoundingClientRect().height<30).length;
 const snip=e=>e.outerHTML.replace(/\\s+/g,' ').replace(/ style="[^"]*"/g,'').slice(0,150);
 const T=main.innerText||''; const dates=[...new Set([...(T.match(/\\b20[12]\\d-\\d\\d-\\d\\d\\b/g)||[]),...(T.match(/(?<![\\d:])0[1-9] (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\b/g)||[])])].slice(0,12);
 return {len:T.trim().length,hscroll:document.documentElement.scrollWidth>vw+2,over,tiny,upper,clipped,btnNoName:unnamedBtn.length,inpNoLabel:unlabelled.length,
   remote,small,dates,where:[...unlabelled.slice(0,4),...unnamedBtn.slice(0,3)].map(snip)};
}"""


async def sweep(url, out, user, password, chrome):
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    async with async_playwright() as p:
        b = await p.chromium.launch(**({"executable_path": chrome} if chrome else {}))
        pg = await b.new_page(viewport={"width": 1440, "height": 900}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:160]))
        pg.on("console", lambda m: errs.append("console: " + m.text[:160]) if m.type == "error" else None)

        async def sign_in():
            await pg.goto(url); await pg.wait_for_selector("#login-username", timeout=90000)
            await pg.fill("#login-username", user); await pg.fill("#login-password", password); await pg.click("button[type=submit]")
            await pg.locator("aside").first.wait_for(timeout=30000)

        async def measure(dept, label):
            await pg.wait_for_timeout(450); e = list(errs); errs.clear()
            try: m = await pg.evaluate(JS)
            except Exception as ex: m = {"len": 0, "crash": str(ex)[:100]}
            await pg.set_viewport_size({"width": 1024, "height": 768}); await pg.wait_for_timeout(250)
            try: n = await pg.evaluate(JS)
            except Exception: n = {}
            await pg.set_viewport_size({"width": 1440, "height": 900})
            name = re.sub(r"[^a-z0-9]+", "-", f"{dept}-{label}".lower()).strip("-")
            try: await pg.screenshot(path=str(out / f"{name}.png"))
            except Exception: pass
            rows.append({"dept": dept, "screen": label, "file": name, "errors": e, **m, "hscroll": m.get("hscroll") or n.get("hscroll"), "over1024": n.get("over")})

        await sign_in()
        await measure("Suite", "Suite Home")
        for d in DEPTS:
            try:
                await pg.locator("aside").get_by_text("Suite Home", exact=True).first.click(); await pg.wait_for_timeout(400)
                await pg.locator("main").get_by_text(d, exact=True).first.click(timeout=4000); await pg.wait_for_timeout(500)
                # A department name can also be a tag on a Suite Home alert, which opens a screen instead of the department.
                if await pg.locator("aside").get_by_text(d, exact=True).count() == 0:
                    raise Exception(f"clicked '{d}' but the sidebar is not {d}")
            except Exception as ex:
                rows.append({"dept": d, "screen": "(cannot open department)", "errors": [str(ex)[:160]]}); continue
            await measure(d, "Department home")
            labels = [t.strip() for t in await pg.locator("aside button").all_inner_texts()]
            for l in [l for l in labels if l and l not in ("Suite Home", d) and "·" not in l and "\n" not in l]:
                try:
                    await pg.locator("aside").get_by_role("button", name=l, exact=True).first.click(timeout=3000)
                    await measure(d, l)
                except Exception as ex:
                    rows.append({"dept": d, "screen": l, "errors": ["could not open: " + str(ex)[:120]]})
                    if await pg.locator("aside").count() == 0:  # the app crashed: start again from sign-in
                        await sign_in(); break
        await b.close()
    (out / "report.json").write_text(json.dumps(rows, indent=1))
    return rows


def main():
    ap = argparse.ArgumentParser(description="Open every screen and check it.")
    ap.add_argument("--url", default=os.environ.get("SWEEP_URL", "http://localhost:5173/"))
    ap.add_argument("--out", default=os.environ.get("SWEEP_OUT", str(ROOT / "sweep-report")))
    ap.add_argument("--user", default=os.environ.get("SWEEP_USER", "adaeze.okonkwo"))
    ap.add_argument("--password", default=os.environ.get("SWEEP_PASSWORD", "demo123"))
    ap.add_argument("--chrome", default=os.environ.get("SWEEP_CHROME"), help="path to a Chrome to use instead of Playwright's Chromium")
    a = ap.parse_args()
    rows = asyncio.run(sweep(a.url, Path(a.out), a.user, a.password, a.chrome))
    bad = [r for r in rows if any(r.get(k) for k in FAIL) or r["screen"].startswith("(")]
    print(f"{len(rows)} screens swept, {len(bad)} with problems. Report and screenshots: {a.out}")
    for r in bad:
        print(f"  {r['dept']} / {r['screen']}: " + ", ".join(f"{k}={r[k]}" for k in FAIL if r.get(k)))
        for w in r.get("where") or []: print(f"      {w}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
