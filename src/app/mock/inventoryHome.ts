export type ReorderSuggestion = {
  id: string;
  branch: "Abuja" | "Lagos";
  product: string;
  unit: string;
  onHand: number;
  reorderLevel: number;
  suggestedQty: number;
  supplier: string;
  lastPrice: number;
  priority: "Critical" | "High" | "Normal";
};

export type InventoryException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "purchase-orders" | "stock-transactions";
  screenLabel: string;
};

export const INVENTORY_KPIS = [
  { label: "Items below reorder level", value: "17", sub: "6 critical · 11 low", delta: "+3 today", deltaPositive: false },
  { label: "Open purchase orders", value: "9", sub: "₦6.84m committed", delta: "3 awaiting approval", deltaPositive: true },
  { label: "Stock value", value: "₦48.6m", sub: "Abuja ₦29.4m · Lagos ₦19.2m", delta: "+2.1%", deltaPositive: true },
  { label: "Deliveries due this week", value: "7", sub: "4 Abuja · 3 Lagos", delta: "1 overdue", deltaPositive: false },
] as const;

export const REORDER_SUGGESTIONS: ReorderSuggestion[] = [
  { id: "SKU-FB-014", branch: "Abuja", product: "Premium long-grain rice", unit: "50 kg bag", onHand: 3, reorderLevel: 12, suggestedQty: 20, supplier: "Northern Grains Ltd", lastPrice: 86500, priority: "Critical" },
  { id: "SKU-HK-022", branch: "Abuja", product: "King-size white bedsheet", unit: "Piece", onHand: 18, reorderLevel: 30, suggestedQty: 48, supplier: "Lagos Hotel Textiles", lastPrice: 18500, priority: "Critical" },
  { id: "SKU-MX-008", branch: "Abuja", product: "Generator diesel", unit: "Litre", onHand: 1860, reorderLevel: 3000, suggestedQty: 2500, supplier: "A.A. Rano", lastPrice: 1310, priority: "Critical" },
  { id: "SKU-FB-031", branch: "Lagos", product: "Fresh croaker fish", unit: "Kilogram", onHand: 8, reorderLevel: 20, suggestedQty: 35, supplier: "Eko Fresh Foods", lastPrice: 7200, priority: "High" },
  { id: "SKU-GR-019", branch: "Abuja", product: "Guest dental kit", unit: "Carton of 100", onHand: 4, reorderLevel: 8, suggestedQty: 12, supplier: "West African Amenities", lastPrice: 48500, priority: "High" },
  { id: "SKU-FB-044", branch: "Lagos", product: "Bottled water 75 cl", unit: "Pack of 12", onHand: 26, reorderLevel: 40, suggestedQty: 60, supplier: "CWAY Nigeria", lastPrice: 4800, priority: "Normal" },
];

export const INVENTORY_EXCEPTIONS: InventoryException[] = [
  { id: "INV-01", title: "Price increase over 10%", detail: "Lagos Hotel Textiles raised king bedsheets from ₦18,500 to ₦21,500 (+16.2%).", severity: "Warning", screen: "purchase-orders", screenLabel: "Purchase Orders" },
  { id: "INV-02", title: "Overdue delivery", detail: "PO-2607-184 from Eko Fresh Foods was due yesterday at 16:00.", severity: "Critical", screen: "purchase-orders", screenLabel: "Purchase Orders" },
  { id: "INV-03", title: "Stock variance after count", detail: "Abuja beverage store is 14 bottles short, valued at ₦38,500.", severity: "Warning", screen: "stock-transactions", screenLabel: "Stock Transactions" },
];
