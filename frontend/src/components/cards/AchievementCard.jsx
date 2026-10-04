import Acts from '../ui/Acts';
import { tilt, untilt } from '../../utils/helpers';

export default function AchievementCard({ a, onEdit, onDel }) {
  return (
    <div className="card rv" data-id={a.id} style={{ gridColumn: 'auto' }} onMouseMove={tilt} onMouseLeave={untilt}>
      <Acts onEdit={onEdit} onDel={onDel} />
      {a.img ? <img src={a.img} alt={a.title} style={{ aspectRatio: '3/2' }} /> : <div className="ph grad">★</div>}
      <span className="bdg">{a.type}</span>
      <h3>{a.title}</h3>
      <p>{a.org}{a.date ? ' · ' + a.date : ''}</p>
      <div className="links">{a.link && <a href={a.link} target="_blank" rel="noopener noreferrer">View credential ↗</a>}</div>
    </div>
  );
}
