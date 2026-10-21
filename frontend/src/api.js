// api.js
// Every call from the React app to the backend lives in this one file,
// so if the API ever changes, this is the only place to update.
//
// These use relative URLs like "/api/products". The Vite dev server is
// configured (see vite.config.js) to forward those to the backend at
// http://localhost:3001, so the frontend never needs to know the
// backend's address itself.

const API_URL = "/api/products";

// Shared logic: receive the server's response, turn it into usable data,
// and turn problems into Exceptions with clear, human-readable messages.
async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(
      data?.error || "Something went wrong talking to the server."
    );
    // Validation problems arrive as { errors: { field: "message" } }
    if (data?.errors) error.fieldErrors = data.errors;
    throw error;
  }

  return data;
}

// GET /api/products → list of all products
export async function getProducts() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

// POST /api/products → create a new product
export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

// PUT /api/products/:id → edit an existing product
export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

// DELETE /api/products/:id → remove a product
export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
