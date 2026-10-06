import { useEffect } from 'react';

export default function DeleteConfirmation({ screenshot, onCancel, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <section
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="section-kicker">This can’t be undone</p>
        <h2 id="delete-confirmation-title">Delete “{screenshot.name}”?</h2>
        <p id="delete-confirmation-description">
          This screenshot will be permanently removed from your AUREUS library.
        </p>
        <footer className="confirmation-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel} autoFocus>Keep screenshot</button>
          <button type="button" className="btn btn--danger-strong" onClick={onConfirm}>Delete “{screenshot.name}”</button>
        </footer>
      </section>
    </div>
  );
}
