import { getOrdersForBackup } from "../_db/database";

export function buildBackupJSON() {
  const rows = getOrdersForBackup();
  const map: any = {};

  rows.forEach((r: any) => {
    if (!map[r.order_id]) {
      map[r.order_id] = {
        id: r.order_id,
        total: r.total,
        created_at: r.created_at,
        items: [],
      };
    }

    map[r.order_id].items.push({
      name: r.name,
      qty: r.qty,
      price: r.price,
    });
  });

  return {
    generated_at: new Date().toISOString(),
    orders: Object.values(map),
  };
}
