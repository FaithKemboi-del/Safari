import type { ReactNode } from 'react';

type AdminModalProps = {
  title: string;
  eyebrow?: string;
  lead?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function AdminModal({
  title,
  eyebrow = 'Create or edit',
  lead,
  onClose,
  children,
  wide = false,
}: AdminModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className={`modal-card ${wide ? 'modal-card--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <button className="modal-close" onClick={onClose} type="button">
          x
        </button>
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="admin-modal-title">{title}</h2>
        {lead ? <p className="modal-lead">{lead}</p> : null}
        {children}
      </div>
    </div>
  );
}
