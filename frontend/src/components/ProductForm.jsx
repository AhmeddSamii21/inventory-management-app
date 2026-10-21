// ProductForm.jsx
// A pop-up panel (a "modal") used BOTH for adding a new product and for
// editing an existing one:
//   • product = null →  we are adding ("Add a product", empty fields)
//   • product = an existing product → we are editing (prefilled fields)
//
// The form itself does not talk to the server. It just collects the
// values and hands them to App.jsx through onSubmit(). App.jsx then calls
// the API, and if something is wrong it sends the problems back to us:
//   • fieldErrors → per-field messages, e.g. { sku: "That SKU is already used..." }
//   • serverError → one general message for everything else

import { useState, useEffect } from "react";

// Starting values for a brand-new product (all inputs empty).
const EMPTY = { name: "", sku: "", category: "", price: "", quantity: "" };

export default function ProductForm({
  product,
  fieldErrors,
  serverError,
  busy,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY);

  // When the modal opens, fill the inputs: with the product's current
  // values when editing, or blank when adding.
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: String(product.price),
        quantity: String(product.quantity),
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  // One small helper so each input can update its own field in "form".
  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from doing a normal form submit
    onSubmit(form);
  };

  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-labelledby="product-form-title">
        <div className="modal-header">
          <h2 id="product-form-title">
            {product ? "Edit product" : "Add a product"}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {serverError && (
            <div className="form-error" role="alert">
              {serverError}
            </div>
          )}

          <label>
            Name
            <input
              value={form.name}
              onChange={change("name")}
              disabled={busy}
              placeholder="e.g. Claw hammer 16 oz"
            />
            {fieldErrors?.name && (
              <span className="field-error">{fieldErrors.name}</span>
            )}
          </label>

          <label>
            SKU <span className="label-hint">(stock keeping code, must be unique)</span>
            <input
              value={form.sku}
              onChange={change("sku")}
              disabled={busy}
              placeholder="e.g. TOOL-001"
            />
            {fieldErrors?.sku && (
              <span className="field-error">{fieldErrors.sku}</span>
            )}
          </label>

          <label>
            Category
            <input
              value={form.category}
              onChange={change("category")}
              disabled={busy}
              placeholder="e.g. Tools"
            />
            {fieldErrors?.category && (
              <span className="field-error">{fieldErrors.category}</span>
            )}
          </label>

          <div className="form-row">
            <label>
              Price ($)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={change("price")}
                disabled={busy}
                placeholder="e.g. 12.99"
              />
              {fieldErrors?.price && (
                <span className="field-error">{fieldErrors.price}</span>
              )}
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={change("quantity")}
                disabled={busy}
                placeholder="e.g. 25"
              />
              {fieldErrors?.quantity && (
                <span className="field-error">{fieldErrors.quantity}</span>
              )}
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : product ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
