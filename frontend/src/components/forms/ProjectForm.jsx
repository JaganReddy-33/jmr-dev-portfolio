import useForm from '../../hooks/useForm';
import ImagePicker from '../ui/ImagePicker';

export default function ProjectForm({ init, onSave }) {
  const { f, setF, bind } = useForm(init);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="row">
        <input required placeholder="Title" {...bind('title')} />
        <input placeholder="Tech (comma separated)" {...bind('tech')} />
      </div>
      <textarea required rows="6" placeholder={'Description: one point per line (or use •).\nThe first 2 points show on the card; all of them show in the popup.'} {...bind('desc')} />
      <div className="row">
        <input type="url" placeholder="Code link (GitHub)" {...bind('code')} />
        <input type="url" placeholder="Live link (optional)" {...bind('live')} />
      </div>
      <ImagePicker value={f.img} onChange={(img) => setF((o) => ({ ...o, img }))} />
      <button className="btn">{init.id ? 'Save Changes' : 'Add Project'}</button>
    </form>
  );
}