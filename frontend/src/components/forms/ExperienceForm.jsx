import useForm from '../../hooks/useForm';
import { expRange, periodLabel } from '../../utils/dates';

export default function ExperienceForm({ init, onSave }) {
  const { f, setF, bind } = useForm({ ...init, ...expRange(init), tech: init.tech || '' });
  const submit = (e) => {
    e.preventDefault();
    const item = { ...f, end: f.current ? '' : f.end };
    onSave({ ...item, period: periodLabel(item) });
  };
  return (
    <form onSubmit={submit}>
      <div className="row">
        <input required placeholder="Role" {...bind('role')} />
        <input required placeholder="Company" {...bind('org')} />
      </div>
      <div className="row">
        <label className="fl">Start date<input required type="month" {...bind('start')} /></label>
        <label className="fl">End date<input type="month" required={!f.current} disabled={!!f.current} min={f.start || undefined} {...bind('end')} /></label>
      </div>
      <label className="chk">
        <input type="checkbox" checked={!!f.current} onChange={(e) => setF((o) => ({ ...o, current: e.target.checked, end: e.target.checked ? '' : o.end }))} />
        I currently work here
      </label>
      <input placeholder="Tech stack used (comma separated, e.g. React, Node.js, MongoDB)" {...bind('tech')} />
      <textarea rows="4" placeholder="Highlights, separated by |" {...bind('pts')} />
      <button className="btn">{init.id ? 'Save Changes' : 'Add Experience'}</button>
    </form>
  );
}