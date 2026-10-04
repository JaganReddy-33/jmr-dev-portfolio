import useForm from '../../hooks/useForm';
import ImagePicker from '../ui/ImagePicker';

export default function AchievementForm({ init, onSave }) {
  const { f, setF, bind } = useForm(init);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <input required placeholder="Title (e.g. Oracle AI Foundations)" {...bind('title')} />
      <div className="row">
        <input required placeholder="Issuer" {...bind('org')} />
        <input placeholder="Date / year" {...bind('date')} />
      </div>
      <select {...bind('type')} style={{ padding: 12, borderRadius: 10, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--fg)' }}>
        <option>Certificate</option><option>Publication</option><option>Award</option><option>Workshop</option>
      </select>
      <input type="url" placeholder="Credential / certificate link" {...bind('link')} />
      <ImagePicker value={f.img} onChange={(img) => setF((o) => ({ ...o, img }))} />
      <button className="btn">{init.id ? 'Save Changes' : 'Add Achievement'}</button>
    </form>
  );
}
