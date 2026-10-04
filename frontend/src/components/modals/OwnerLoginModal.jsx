import { useState } from 'react';
import { useOwner } from '../../context/OwnerContext';
import Modal from '../ui/Modal';

export default function OwnerLoginModal({ open, onClose }) {
  const { login } = useOwner();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (await login(key)) { setKey(''); setError(''); onClose(); } else setError('Wrong key.');
  };
  return (
    <Modal open={open} onClose={onClose} title="Owner login">
      <form onSubmit={submit}>
        <input required autoFocus type="password" placeholder="Admin key" value={key} onChange={(e) => setKey(e.target.value)} />
        {error && <span className="hint" style={{ color: '#e5484d' }}>{error}</span>}
        <button className="btn">Unlock editing</button>
      </form>
    </Modal>
  );
}
