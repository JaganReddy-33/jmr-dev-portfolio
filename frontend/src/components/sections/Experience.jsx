import { useState } from 'react';
import { useData } from '../../context/DataContext';
import SectionHead from '../ui/SectionHead';
import AddButton from '../ui/AddButton';
import Acts from '../ui/Acts';
import Modal from '../ui/Modal';
import ExperienceForm from '../forms/ExperienceForm';
import { flash, uid } from '../../utils/helpers';

export default function Experience() {
  const { experience: [list, put, del] } = useData();
  const [ed, setEd] = useState(null);
  const save = (f) => { const id = f.id || uid(); put({ ...f, id }); setEd(null); flash(id); };

  return (
    <section id="experience">
      <SectionHead n="02" title="Experience" accent="Work" sub="Internships and roles, newest first.">
        <AddButton onClick={() => setEd({ role: '', org: '', period: '', pts: '' })} label="Add Experience" />
      </SectionHead>
      <div className="tl">
        {[...list].reverse().map((x) => (
          <div className="card rv" key={x.id} data-id={x.id}>
            <Acts onEdit={() => setEd(x)} onDel={() => del(x.id)} />
            <small>{x.period}</small>
            <h3>{x.role}</h3>
            <p style={{ margin: '2px 0 8px' }}>{x.org}</p>
            <ul>{(x.pts || '').split('|').filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        ))}
      </div>
      {!list.length && <div className="empty">No experience yet.</div>}
      <Modal open={!!ed} onClose={() => setEd(null)} title={ed?.id ? 'Edit experience' : 'Add experience'}>
        {ed && <ExperienceForm init={ed} onSave={save} />}
      </Modal>
    </section>
  );
}
