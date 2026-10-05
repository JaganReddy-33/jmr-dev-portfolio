import Modal from '../ui/Modal';
import { GithubIcon } from '../ui/Icons';
import { initialsOf, techList, toBullets } from '../../utils/text';

/** Full project details, opened by clicking a project card. */
export default function ProjectDetailModal({ p, onClose }) {
  return (
    <Modal open={!!p} onClose={onClose} wide title={p?.title || ''}>
      {p && (
        <>
          {p.img ? <img className="pd-img" src={p.img} alt={p.title} /> : <div className="ph grad pd-ph">{initialsOf(p.title)}</div>}
          <h4 className="pd-h">About this project</h4>
          <ul className="pd-points">{toBullets(p.desc).map((b, i) => <li key={i}>{b}</li>)}</ul>
          {!!techList(p.tech).length && (
            <>
              <h4 className="pd-h">Tech stack</h4>
              <div className="pills">{techList(p.tech).map((t) => <span key={t}>{t}</span>)}</div>
            </>
          )}
          <div className="btns" style={{ marginTop: 18 }}>
            {p.code && <a className="btn" href={p.code} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} /> View code</a>}
            {p.live && <a className="btn g" href={p.live} target="_blank" rel="noopener noreferrer">↗ Live demo</a>}
          </div>
        </>
      )}
    </Modal>
  );
}