import useForm from '../../hooks/useForm';
import { toMonth } from '../../utils/dates';
import ImagePicker from '../ui/ImagePicker';

export default function AchievementForm({ init, onSave }) {
  const { f, setF, bind } = useForm({ ...init, date: toMonth(init.date) });
  // Keep an old free-text date (e.g. "2023") if the owner doesn't pick a month.
  const submit = (e) => { e.preventDefault(); onSave({ ...f, date: f.date || init.date || '' }); };
  return (
    <form onSubmit={submit}>
      <input required placeholder="Title (e.g. Oracle AI Foundations)" {...bind('title')} />
      <div className="row">
        <input required placeholder="Issuer" {...bind('org')} />
        <label className="fl">Date received<input type="month" {...bind('date')} /></label>
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