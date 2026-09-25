import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function ReactModal({ name, title, children, className = '', onRequestClose }) {
  const { modal, closeModal } = useApp();
  const open = modal?.name === name;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') (onRequestClose || closeModal)();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeModal, onRequestClose]);

  if (!open) return null;
  const close = onRequestClose || closeModal;

  return (
    <div className={`vq-react-modal ${className}`} role="dialog" aria-modal="true" aria-label={title || name}>
      <div className="vq-react-modal__backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()} />
      <section className="vq-react-modal__panel">
        <button type="button" className="vq-react-modal__close" onClick={close} aria-label="Close">×</button>
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </div>
  );
}
