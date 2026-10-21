// DeleteModal.jsx
// A confirmation pop-up shown before deleting a product, so one stray
// click can never wipe out stock data by accident.

export default function DeleteModal({ product, busy, onCancel, onConfirm }) {
  return (
    <div className="overlay">
      <div className="modal modal-small" role="dialog" aria-labelledby="delete-title">
        <h2 id="delete-title">Delete product?</h2>
        <p className="modal-text">
          You are about to permanently delete{" "}
          <strong>
            "{product.name}" (SKU {product.sku})
          </strong>
          . This cannot be undone.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
