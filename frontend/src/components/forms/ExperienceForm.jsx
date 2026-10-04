import useForm from '../../hooks/useForm';

export default function ExperienceForm({ init, onSave }) {
  const { bind, f } = useForm(init);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="row">
        <input required placeholder="Role" {...bind('role')} />
        <input required placeholder="Company" {...bind('org')} />
      </div>
      <input required placeholder="Period (e.g. Jan 2027 – Present)" {...bind('period')} />
      <textarea rows="4" placeholder="Highlights, separated by |" {...bind('pts')} />
      <button className="btn">{init.id ? 'Save Changes' : 'Add Experience'}</button>
    </form>
  );
}
