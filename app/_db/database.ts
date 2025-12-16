import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("restaurant.db");

/* ------------------- TYPES ------------------- */

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image?: string; // Optional image URI
}

export interface Order {
  id: number;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  menu_id: number;
  qty: number;
  price: number;
}

/* ------------------- INIT DB ------------------- */

export function initDB() {
  // Create menu table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      image TEXT
    );
  `);

  // Check if image column exists, if not add it
  try {
    const tableInfo = db.getAllSync(`PRAGMA table_info(menu);`) as any[];
    const hasImageColumn = tableInfo.some((col: any) => col.name === 'image');
    
    if (!hasImageColumn) {
      console.log('Adding image column to menu table...');
      db.execSync(`ALTER TABLE menu ADD COLUMN image TEXT;`);
      console.log('Image column added successfully!');
    }
  } catch (error) {
    console.log('Error checking/adding image column:', error);
  }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL
    );
  `);

   seedMenu();
}

/* ------------------- MENU UTILITIES ------------------- */

export function resetMenu() {
  db.execSync("DELETE FROM menu;");
  db.execSync("DELETE FROM sqlite_sequence WHERE name='menu';");
}

export function seedMenu() {
  // Check if menu is already seeded
  const count = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM menu"
  );
  
  if (count && count.count > 0) {
    return; // Already seeded, skip
  }

  const items = [
    ["Tea", 10, null],
    ["Dosai", 45, null],
    ["Parotta", 20, null],
  ];

  for (const [name, price, image] of items) {
    db.runSync(
      "INSERT OR IGNORE INTO menu (name, price, image) VALUES (?, ?, ?)",
      [name, price, image]
    );
  }
}

export function getMenuItems(cb: (items: MenuItem[]) => void) {
  const result = db.getAllSync<MenuItem>(
    "SELECT * FROM menu ORDER BY name ASC"
  );
  cb(result);
}

/* ------------------- ADD MENU ITEM ------------------- */

export function addMenuItem(
  name: string,
  price: number,
  image: string | null,
  cb?: (success: boolean, error?: string) => void
) {
  try {
    db.runSync(
      "INSERT INTO menu (name, price, image) VALUES (?, ?, ?)",
      [name, price, image]
    );
    if (cb) cb(true);
  } catch (error: any) {
    if (cb) cb(false, error.message || "Failed to add menu item");
  }
}

/* ------------------- UPDATE MENU ITEM ------------------- */

export function updateMenuItem(
  id: number,
  name: string,
  price: number,
  image: string | null,
  cb?: (success: boolean, error?: string) => void
) {
  try {
    db.runSync(
      "UPDATE menu SET name = ?, price = ?, image = ? WHERE id = ?",
      [name, price, image, id]
    );
    if (cb) cb(true);
  } catch (error: any) {
    if (cb) cb(false, error.message || "Failed to update menu item");
  }
}

/* ------------------- DELETE MENU ITEM ------------------- */

export function deleteMenuItem(
  id: number,
  cb?: (success: boolean) => void
) {
  try {
    db.runSync("DELETE FROM menu WHERE id = ?", [id]);
    if (cb) cb(true);
  } catch (error) {
    if (cb) cb(false);
  }
}

/* ------------------- SAVE ORDER ------------------- */

export function saveOrder(
  items: (MenuItem & { qty: number })[],
  total: number,
  cb?: () => void
) {
  // 1️⃣ Insert order
  const orderInsert = db.runSync(
    "INSERT INTO orders (total, created_at) VALUES (?, datetime('now'))",
    [total]
  );

  const orderId = orderInsert.lastInsertRowId;

  // 2️⃣ Insert order items
  items.forEach((item) => {
    db.runSync(
      "INSERT INTO order_items (order_id, menu_id, qty, price) VALUES (?, ?, ?, ?)",
      [orderId, item.id, item.qty, item.price]
    );
  });

  if (cb) cb();
}

/* ------------------- GET ALL ORDERS ------------------- */

export function getOrders(cb: (orders: Order[]) => void) {
  const rows = db.getAllSync<Order>(
    "SELECT * FROM orders ORDER BY id DESC"
  );
  cb(rows);
}

/* ------------------- EXTRA: GET ITEMS OF ONE ORDER ------------------- */

export function getOrderItemsByOrder(
  orderId: number,
  cb: (items: (OrderItem & { name: string })[]) => void
) {
  const rows = db.getAllSync(
    `
      SELECT 
        oi.*, 
        m.name 
      FROM order_items oi
      JOIN menu m ON m.id = oi.menu_id
      WHERE oi.order_id = ?
    `,
    [orderId]
  ) as (OrderItem & { name: string })[];

  cb(rows);
}

/* ------------------- CLEAN UP DUPLICATES ------------------- */

export function cleanupDuplicates() {
  // Delete all but the first occurrence of each name
  db.execSync(`
    DELETE FROM menu 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM menu 
      GROUP BY name
    )
  `);
}

export function clearMenu() {
  db.execSync("DELETE FROM menu;");
  db.execSync("DELETE FROM sqlite_sequence WHERE name='menu';");
}

export function clearOrders() {
  db.execSync("DELETE FROM order_items;");
  db.execSync("DELETE FROM orders;");
  db.execSync("DELETE FROM sqlite_sequence WHERE name='orders';");
  db.execSync("DELETE FROM sqlite_sequence WHERE name='order_items';");
}

/* ------------------- BACKUP QUERY ------------------- */

export function getOrdersForBackup() {
  return db.getAllSync(`
    SELECT 
      o.id as order_id,
      o.total,
      o.created_at,
      m.name,
      oi.qty,
      oi.price
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menu m ON m.id = oi.menu_id
    ORDER BY o.id ASC
  `);
}


// export const deleteMenuItem = (id: number, cb: () => void) => {
//   db.execSync("DELETE FROM menu WHERE id = ?", [id]);
//   cb();
// };
