// server.js
// The "engine" of the app: an Express web server with API routes for
// managing products (list, add, edit, delete). The React frontend talks
// to this server at http://localhost:3001

const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3001;

// Lets Express read the JSON that the frontend sends in request bodies.
app.use(express.json());

// ---------------------------------------------------------------------
// Validation helper
// Checks a product received from the frontend and builds an object of
// human-readable error messages, one per bad field.
// ---------------------------------------------------------------------
function validateProduct(body) {
  const errors = {};

  // -- name: must be a non-empty piece of text
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name === "") errors.name = "Product name is required.";

  // -- sku: must be a non-empty piece of text
  const sku = typeof body.sku === "string" ? body.sku.trim() : "";
  if (sku === "") errors.sku = "SKU is required.";

  // -- category: must be a non-empty piece of text
  const category = typeof body.category === "string" ? body.category.trim() : "";
  if (category === "") errors.category = "Category is required.";

  // -- price: must be a number that is 0 or more
  let price = body.price;
  if (price === undefined || price === null || price === "") {
    errors.price = "Price is required.";
  } else {
    price = Number(price);
    if (!Number.isFinite(price) || price < 0) {
      errors.price = "Price must be a number of 0 or more.";
    } else {
      price = Math.round(price * 100) / 100; // keep max 2 decimal places
    }
  }

  // -- quantity: must be a whole number (an integer) that is 0 or more
  let quantity = body.quantity;
  if (quantity === undefined || quantity === null || quantity === "") {
    errors.quantity = "Quantity is required.";
  } else {
    quantity = Number(quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.quantity = "Quantity must be a whole number of 0 or more.";
    }
  }

  return { errors, values: { name, sku, category, price, quantity } };
}

// Turns the route parameter (always text, e.g. "3") into a valid ID
// number, or returns null if it is not usable.
function productIdFrom(param) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---------------------------------------------------------------------
// GET /api/products  →  list every product, newest first
// ---------------------------------------------------------------------
app.get("/api/products", (req, res) => {
  const products = db
    .prepare("SELECT * FROM products ORDER BY created_at DESC, id DESC")
    .all();
  res.json(products);
});

// ---------------------------------------------------------------------
// POST /api/products  →  add a new product (expects all fields in body)
// ---------------------------------------------------------------------
app.post("/api/products", (req, res) => {
  const { errors, values } = validateProduct(req.body || {});

  // SKU must be unique — check before inserting so we can give the
  // user a clear message instead of a cryptic database error.
  const duplicate = db
    .prepare("SELECT id FROM products WHERE sku = ?")
    .get(values.sku);
  if (duplicate) errors.sku = "That SKU is already used by another product.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const info = db
    .prepare(
      "INSERT INTO products (name, sku, category, price, quantity) VALUES (?, ?, ?, ?, ?)"
    )
    .run(values.name, values.sku, values.category, values.price, values.quantity);

  const created = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(info.lastInsertRowid);
  res.status(201).json(created);
});

// ---------------------------------------------------------------------
// PUT /api/products/:id  →  edit an existing product (expects all fields)
// ---------------------------------------------------------------------
app.put("/api/products/:id", (req, res) => {
  const id = productIdFrom(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id." });
  }

  const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Product not found." });
  }

  const { errors, values } = validateProduct(req.body || {});

  // SKU must stay unique across products (except this very product).
  const duplicate = db
    .prepare("SELECT id FROM products WHERE sku = ? AND id != ?")
    .get(values.sku, id);
  if (duplicate) errors.sku = "That SKU is already used by another product.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  db.prepare(
    "UPDATE products SET name = ?, sku = ?, category = ?, price = ?, quantity = ? WHERE id = ?"
  ).run(values.name, values.sku, values.category, values.price, values.quantity, id);

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  res.json(updated);
});

// ---------------------------------------------------------------------
// DELETE /api/products/:id  →  remove a product
// ---------------------------------------------------------------------
app.delete("/api/products/:id", (req, res) => {
  const id = productIdFrom(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id." });
  }

  const info = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Product not found." });
  }
  res.json({ message: "Product deleted." });
});

// ---------------------------------------------------------------------
// GET /  →  simple health check so we know the server is alive
// ---------------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Inventory app backend is running!" });
});

// ---------------------------------------------------------------------
// Error catcher: if the frontend sends broken JSON (or anything else
// Express cannot even parse), reply with a clear 400 instead of a crash.
// ---------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(400).json({ errors: { body: "Invalid data sent to server." } });
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
