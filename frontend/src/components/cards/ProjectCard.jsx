import Acts from '../ui/Acts';
import { GithubIcon } from '../ui/Icons';
import { tilt, untilt } from '../../utils/helpers';
import { initialsOf, techList, toBullets } from '../../utils/text';

/** Fixed layout so every card is the same size: preview, title, 2 bullets, tech, links. Click opens details. */
export default function ProjectCard({ p, onOpen, onEdit, onDel }) {
  const bullets = toBullets(p.desc).slice(0, 2);
  const tech = techList(p.tech), shown = tech.slice(0, 3), extra = tech.length - shown.length;
  const onKey = (e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpen(p); } };

  return (
    <div className="card pc rv" data-id={p.id} role="button" tabIndex={0} aria-label={`Open details for ${p.title}`}
      onClick={() => onOpen(p)} onKeyDown={onKey} onMouseMove={tilt} onMouseLeave={untilt}>
      <Acts onEdit={onEdit} onDel={onDel} />
      <div className="pc-img">{p.img ? <img src={p.img} alt="" loading="lazy" /> : <div className="ph grad">{initialsOf(p.title)}</div>}</div>
      <h3 className="pc-title">{p.title}</h3>
      <ul className="pc-points">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
      <div className="pills">{shown.map((t) => <span key={t}>{t}</span>)}{extra > 0 && <span>+{extra}</span>}</div>
      <div className="links" onClick={(e) => e.stopPropagation()}>
        {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} /> Code</a>}
        {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">↗ Live</a>}
        <span className="pc-more">Details →</span>
      </div>
    </div>
  );
}