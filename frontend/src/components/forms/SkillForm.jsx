import useForm from '../../hooks/useForm';

export default function SkillForm({ init, heads, onSave }) {
  const { f, bind } = useForm(init);
  const exists = !init.id && heads.some((h) => h.toLowerCase() === f.head.trim().toLowerCase());
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <input required list="skill-heads" placeholder="Heading (e.g. Frontend)" {...bind('head')} />
      <datalist id="skill-heads">{heads.map((h) => <option key={h} value={h} />)}</datalist>
      {exists && <span className="hint">This heading exists, so the skills will be added to it.</span>}
      <textarea required rows="3" placeholder="Skills, comma separated (e.g. React, Redux)" {...bind('items')} />
      <button className="btn">{init.id ? 'Save Changes' : 'Add Skills'}</button>
    </form>
  );
}
