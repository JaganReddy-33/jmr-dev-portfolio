import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import SectionHead from '../ui/SectionHead';
import AddButton from '../ui/AddButton';
import Modal from '../ui/Modal';
import ProjectCard from '../cards/ProjectCard';
import AchievementCard from '../cards/AchievementCard';
import ProjectForm from '../forms/ProjectForm';
import AchievementForm from '../forms/AchievementForm';
import ProjectDetailModal from '../modals/ProjectDetailModal';
import { sortByDateDesc } from '../../utils/dates';
import { flash, uid } from '../../utils/helpers';

const BLANK_PROJECT = { title: '', desc: '', tech: '', code: '', live: '', img: '' };
const BLANK_ACH = { title: '', org: '', date: '', type: 'Certificate', link: '', img: '' };

/** Projects (default) and Achievements share one section, switched with a filter tab. */
export default function ProjectsSection() {
  const { projects: [projects, putProject, delProject], ach: [achs, putAch, delAch] } = useData();
  const [tab, setTab] = useState('projects');
  const [ed, setEd] = useState(null);
  const [detail, setDetail] = useState(null);
  const isProjects = tab === 'projects';
  const sortedAch = useMemo(() => sortByDateDesc(achs, (a) => a.date), [achs]); // newest first, undated last
  const save = (f) => { const id = f.id || uid(); (isProjects ? putProject : putAch)({ ...f, id }); setEd(null); flash(id); };

  return (
    <section id="projects">
      <SectionHead n="03" title={isProjects ? 'Projects' : 'Achievements'} accent={isProjects ? 'Featured' : 'Certificates &'}
        sub={isProjects ? 'Click a project to see the full details.' : 'Certifications, workshops and publications, newest first.'}>
        <AddButton onClick={() => setEd(isProjects ? BLANK_PROJECT : BLANK_ACH)} label={isProjects ? 'Add Project' : 'Add Achievement'} />
      </SectionHead>
      <div className="tabs rv" role="tablist">
        <button className={isProjects ? 'sel' : ''} onClick={() => setTab('projects')}>Projects ({projects.length})</button>
        <button className={isProjects ? '' : 'sel'} onClick={() => setTab('ach')}>Achievements ({achs.length})</button>
      </div>
      <div className="grid">
        {isProjects
          ? projects.map((p) => <ProjectCard key={p.id} p={p} onOpen={setDetail} onEdit={() => setEd(p)} onDel={() => delProject(p.id)} />)
          : sortedAch.map((a) => <AchievementCard key={a.id} a={a} onEdit={() => setEd(a)} onDel={() => delAch(a.id)} />)}
      </div>
      {!(isProjects ? projects : achs).length && <div className="empty">Nothing here yet.</div>}
      <ProjectDetailModal p={detail} onClose={() => setDetail(null)} />
      <Modal open={!!ed} onClose={() => setEd(null)} title={`${ed?.id ? 'Edit' : 'Add'} ${isProjects ? 'project' : 'achievement'}`}>
        {ed && (isProjects ? <ProjectForm init={ed} onSave={save} /> : <AchievementForm init={ed} onSave={save} />)}
      </Modal>
    </section>
  );
}