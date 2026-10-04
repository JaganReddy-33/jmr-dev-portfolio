import { useData } from '../context/DataContext';
import Hero from '../components/sections/Hero';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import ProjectsSection from '../components/sections/ProjectsSection';
import Contact from '../components/sections/Contact';
import Marquee from '../components/ui/Marquee';

export default function Home({ onResume }) {
  const { skills: [skills] } = useData();
  return (
    <main>
      <Hero onResume={onResume} />
      <Marquee items={skills.flatMap((c) => c.items)} />
      <Skills />
      <Experience />
      <ProjectsSection />
      <Contact />
    </main>
  );
}
