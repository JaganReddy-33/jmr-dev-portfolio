import { useState } from 'react';
import { useOwner } from '../../context/OwnerContext';

/** Edit / delete buttons on a card. Rendered only in owner mode; delete needs a second click. */
export default function Acts({ onEdit, onDel }) {
  const { own } = useOwner();
  const [sure, setSure] = useState(false);
  if (!own) return null;
  const del = () => { if (sure) return onDel(); setSure(true); setTimeout(() => setSure(false), 2500); };
  return (
    <div className="acts" onClick={(e) => e.stopPropagation()}>
      <button aria-label="Edit" onClick={onEdit}>✎ Edit</button>
      <button className={sure ? 'dng' : ''} aria-label="Delete" onClick={del}>{sure ? 'Sure?' : '🗑'}</button>
    </div>
  );
}