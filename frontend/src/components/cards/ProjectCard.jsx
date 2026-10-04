import Acts from '../ui/Acts';
import { tilt, untilt } from '../../utils/helpers';

export default function ProjectCard({ p, onEdit, onDel }) {
  return (
    <div className="card rv" data-id={p.id} onMouseMove={tilt} onMouseLeave={untilt}>
      <Acts onEdit={onEdit} onDel={onDel} />
      {p.img ? <img src={p.img} alt={p.title} /> : <div className="ph grad">{p.title.slice(0, 2)}</div>}
      <h3>{p.title}</h3>
      <p>{p.desc}</p>
      <div className="pills">{(p.tech || '').split(',').filter(Boolean).map((t) => <span key={t}>{t.trim()}</span>)}</div>
      <div className="links">
        {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer">Code ↗</a>}
        {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Live ↗</a>}
      </div>
    </div>
  );
}
