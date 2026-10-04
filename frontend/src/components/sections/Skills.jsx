import { useState } from 'react';
import { useData } from '../../context/DataContext';
import SectionHead from '../ui/SectionHead';
import AddButton from '../ui/AddButton';
import Acts from '../ui/Acts';
import Modal from '../ui/Modal';
import SkillForm from '../forms/SkillForm';
import { flash, tilt, uid, untilt } from '../../utils/helpers';

export default function Skills() {
  const { skills: [list, put, del] } = useData();
  const [ed, setEd] = useState(null);

  const save = (f) => {
    const items = f.items.split(',').map((x) => x.trim()).filter(Boolean), head = f.head.trim();
    let id;
    if (f.id) { id = f.id; put({ id, head, items }); }
    else {
      const existing = list.find((c) => c.head.toLowerCase() === head.toLowerCase());
      if (existing) { id = existing.id; put({ ...existing, items: [...new Set([...existing.items, ...items])] }); }
      else { id = uid(); put({ id, head, items }); }
    }
    setEd(null); flash(id);
  };

  return (
    <section id="skills">
      <SectionHead n="01" title="Stack" accent="Tech" sub="Java first, with MERN to back it up.">
        <AddButton onClick={() => setEd({ head: '', items: '' })} label="Add Skills" />
      </SectionHead>
      <div className="skg">
        {list.map((c) => (
          <div className="card rv" key={c.id} data-id={c.id} onMouseMove={tilt} onMouseLeave={untilt}>
            <Acts onEdit={() => setEd({ ...c, items: c.items.join(', ') })} onDel={() => del(c.id)} />
            <h3>{c.head}</h3>
            <div className="sk">{c.items.map((s) => <span key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
      {!list.length && <div className="empty">No skills yet.</div>}
      <Modal open={!!ed} onClose={() => setEd(null)} title={ed?.id ? 'Edit skill box' : 'Add skills'}>
        {ed && <SkillForm init={ed} heads={list.map((c) => c.head)} onSave={save} />}
      </Modal>
    </section>
  );
}
