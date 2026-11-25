import { describe, expect, test } from "vitest";
import { readMeter, readingsOf, addMeter, meters } from "./meters";
import { noticesFor } from "./notify";

describe("utility meters", () => {
  test("consumption goes through the multiplier; a reading never goes backwards unless it rolled over or was replaced", () => {
    const last = readingsOf("MTR-1")[0].reading;
    const r = readMeter("MTR-1", { reading: last + 1500 }, "Emeka Obi");
    expect(r).toMatchObject({ consumption: 60000 });                     // ×40 current transformer
    expect(readMeter("MTR-1", { reading: 12 }, "Emeka Obi")).toMatch(/rolled over or was replaced/);
    expect(readMeter("MTR-1", { reading: 12, reset: "Replaced" }, "Emeka Obi")).toMatchObject({ consumption: undefined, reset: "Replaced" });
    expect(readMeter("MTR-1", { reading: 20 }, "Emeka Obi")).toMatchObject({ consumption: 320 });
  });

  test("more than three times the recent average is flagged as a likely leak or misread", () => {
    const last = readingsOf("MTR-2")[0].reading;
    expect(readMeter("MTR-2", { reading: last + 400 }, "Chidi Ike")).toMatchObject({ flagged: undefined });
    const big = readMeter("MTR-2", { reading: last + 400 + 1200 }, "Chidi Ike");
    expect(big).toMatchObject({ flagged: true });
    expect(noticesFor("Emeka Obi", "MX").some(n => n.event === "meter.flagged")).toBe(true);
  });

  test("a new meter needs a serial nobody else has and a multiplier above zero", () => {
    expect(addMeter({ kind: "Water", serial: "wb-77812", place: "Pool plant", multiplier: 1, unit: "m³" })).toMatch(/already/);
    expect(addMeter({ kind: "Water", serial: "WB-90001", place: "Pool plant", multiplier: 0, unit: "m³" })).toMatch(/more than zero/);
    expect(addMeter({ kind: "Water", serial: "WB-90001", place: "Pool plant", multiplier: 1, unit: "m³" })).toBeNull();
    expect(meters().some(m => m.serial === "WB-90001")).toBe(true);
  });
});
