import { useOwner } from '../../context/OwnerContext';

export default function AddButton({ onClick, label }) {
  const { own } = useOwner();
  return own ? <button className="btn sm" onClick={onClick}>+ {label}</button> : null;
}
