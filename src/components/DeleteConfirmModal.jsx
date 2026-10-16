import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  application,
  onClose,
  onConfirm
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-hidden="true"
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 id="delete-modal-title" style={{ fontSize: '1.1rem' }}>Delete Application?</h3>
            </div>
          </div>
          <button className="action-icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Are you sure you want to delete the job application for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {application.jobTitle}
            </strong>{' '}
            at{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {application.company}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirm(application.id);
              onClose();
            }}
          >
            <Trash2 size={15} />
            <span>Delete Application</span>
          </button>
        </div>
      </div>
    </div>
  );
}
