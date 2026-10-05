import Acts from '../ui/Acts';
import { tilt, untilt } from '../../utils/helpers';
import { fmtMonth } from '../../utils/dates';

export default function AchievementCard({ a, onEdit, onDel }) {
  return (
    <div className="card pc rv" data-id={a.id} onMouseMove={tilt} onMouseLeave={untilt} style={{ cursor: 'default' }}>
      <Acts onEdit={onEdit} onDel={onDel} />
      <div className="pc-img ac-img">{a.img ? <img src={a.img} alt={a.title} loading="lazy" /> : <div className="ph grad">★</div>}</div>
      <span className="bdg">{a.type}</span>
      <h3 className="pc-title">{a.title}</h3>
      <p className="ac-org">{a.org}{a.date ? ' · ' + fmtMonth(a.date) : ''}</p>
      <div className="links">
        {a.link ? <a href={a.link} target="_blank" rel="noopener noreferrer">View credential ↗</a> : <span className="pc-more" style={{ marginLeft: 0 }}>No link added</span>}
      </div>
    </div>
  );
}