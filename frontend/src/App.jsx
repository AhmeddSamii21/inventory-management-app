// App.jsx
// The main (and currently only) screen of the inventory app.
//
// It manages these situations, each with its own look:
//   • loading   → spinner while products are being fetched
//   • error     → clear message + "Try again" button if the backend
//                 cannot be reached
//   • empty     → friendly prompt when no products exist yet
//   • success   → the products table
//
// Adding, editing and deleting all happen through two pop-up components
// (ProductForm and DeleteModal) plus a small success "toast" message.

import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";
import ProductForm from "./components/ProductForm";
import DeleteModal from "./components/DeleteModal";
import "./App.css";

// Products at or below this quantity get a "Low stock" warning label.
const LOW_STOCK = 5;

export default function App() {
  // ----- table state -----
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ----- form / modal state -----
  const [formOpen, setFormOpen] = useState(false); // add/edit modal visible?
  const [editing, setEditing] = useState(null); // product being edited (null = adding)
  const [deleting, setDeleting] = useState(null); // product awaiting delete confirmation
  const [fieldErrors, setFieldErrors] = useState(null); // per-field validation messages
  const [serverError, setServerError] = useState(null); // one general error message
  const [busy, setBusy] = useState(false); // an API call is in progress
  const [toast, setToast] = useState(null); // small success message

  // Loads the product list from the backend. Also acts as the
  // "Try again" retry after a connection failure.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      setProducts(await getProducts());
    } catch {
      setFetchError(
        "Could not connect to the inventory server. Make sure the backend is running, then try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch the products once when the page first appears.
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Success toasts disappear on their own after 3 seconds.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ----- actions -----
  const openAddForm = () => {
    setEditing(null);
    setFieldErrors(null);
    setServerError(null);
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditing(product);
    setFieldErrors(null);
    setServerError(null);
    setFormOpen(true);
  };

  // Called by ProductForm when the user saves. Decides between
  // creating (adding) and updating (editing) based on "editing".
  const handleSubmit = async (form) => {
    setBusy(true);
    setFieldErrors(null);
    setServerError(null);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        setToast(`"${form.name}" was updated.`);
      } else {
        await createProduct(form);
        setToast(`"${form.name}" was added.`);
      }
      setFormOpen(false);
      await loadProducts(); // refresh the table with fresh data
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors); // highlight specific inputs
      } else {
        setServerError(err.message); // e.g. server switched off mid-save
      }
    } finally {
      setBusy(false);
    }
  };

  // Called by DeleteModal after the user presses "Delete".
  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteProduct(deleting.id);
      setToast(`"${deleting.name}" was deleted.`);
      setDeleting(null);
      await loadProducts();
    } catch {
      setDeleting(null);
      setToast("Something went wrong while deleting. Please try again.");
    } finally {
      setBusy(false);
      await loadProducts(); // re-fetch so the table is always accurate
    }
  };

  // Small statistics shown above the table.
  const lowStockCount = products.filter(
    (p) => Number(p.quantity) <= LOW_STOCK
  ).length;

  // Shows a date like "Oct 21, 2026" from the backend's UTC timestamp.
  const formatDate = (text) =>
    new Date(text.replace(" ", "T") + "Z").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Inventory Manager</h1>
          <p>Track stock levels for your small business</p>
        </div>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Add Product
        </button>
      </header>

      {!loading && !fetchError && (
        <div className="summary">
          <div className="stat">
            <strong>{products.length}</strong>
            <span>Products</span>
          </div>
          <div className={lowStockCount > 0 ? "stat stat-warn" : "stat"}>
            <strong>{lowStockCount}</strong>
            <span>Low stock (5 or fewer)</span>
          </div>
        </div>
      )}

      {/* ----- state 1: table is loading ----- */}
      {loading && (
        <div className="state">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading products…</p>
        </div>
      )}

      {/* ----- state 2: the backend cannot be reached ----- */}
      {!loading && fetchError && (
        <div className="state error-state" role="alert">
          <h2>Can't reach the inventory server</h2>
          <p>{fetchError}</p>
          <button className="btn btn-secondary" onClick={loadProducts}>
            Try again
          </button>
        </div>
      )}

      {/* ----- state 3: no products exist yet ----- */}
      {!loading && !fetchError && products.length === 0 && (
        <div className="state empty-state">
          <p className="empty-icon" aria-hidden="true">
            📦
          </p>
          <h2>No products yet</h2>
          <p>Add your first product to start tracking inventory.</p>
          <button className="btn btn-primary" onClick={openAddForm}>
            + Add your first product
          </button>
        </div>
      )}

      {/* ----- state 4: the products table ----- */}
      {!loading && !fetchError && products.length > 0 && (
        <div className="card">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Added</th>
                <th className="col-actions">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="product-name">{p.name}</td>
                  <td className="text-soft">{p.sku}</td>
                  <td className="text-soft">{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>
                    {p.quantity}
                    {Number(p.quantity) === 0 ? (
                      <span className="tag tag-danger">Out of stock</span>
                    ) : Number(p.quantity) <= LOW_STOCK ? (
                      <span className="tag tag-warn">Low</span>
                    ) : null}
                  </td>
                  <td className="text-soft">{formatDate(p.created_at)}</td>
                  <td className="col-actions">
                    <div className="table-actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEditForm(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger-outline btn-small"
                        onClick={() => setDeleting(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----- pop-ups ----- */}
      {formOpen && (
        <ProductForm
          product={editing}
          fieldErrors={fieldErrors}
          serverError={serverError}
          busy={busy}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deleting && (
        <DeleteModal
          product={deleting}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
