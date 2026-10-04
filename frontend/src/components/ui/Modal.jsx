import { useEffect } from 'react';

export default function Modal({ open, onClose, title, wide, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="ov" onClick={onClose}>
      <div className={'md' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="x" aria-label="Close" onClick={onClose}>✕</button>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
