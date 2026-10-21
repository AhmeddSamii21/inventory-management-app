// database.js
// This file sets up the SQLite database and makes sure the "products"
// table exists. better-sqlite3 stores everything in ONE normal file
// (inventory.db, created automatically next to this file) — there is no
// separate database server to install or manage.

const Database = require("better-sqlite3");

// Opens the database file, or creates it if it does not exist yet.
const db = new Database("inventory.db");

// Creates the products table only if the database is brand new.
// Each product stores: id, name, SKU, category, price, quantity, created_at.
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    sku         TEXT    NOT NULL UNIQUE,
    category    TEXT    NOT NULL,
    price       REAL    NOT NULL CHECK (price >= 0),
    quantity    INTEGER NOT NULL CHECK (quantity >= 0),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// Makes the database available to other files (like server.js).
module.exports = db;
