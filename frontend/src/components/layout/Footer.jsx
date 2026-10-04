import { SITE } from '../../config/site';
import { useOwner } from '../../context/OwnerContext';

export default function Footer({ onLogin }) {
  const { own, logout } = useOwner();
  return (
    <footer className="ft">
      <div className="fg">
        <div>
          <a className="sg grad" href="#home" style={{ fontSize: 26, fontWeight: 700 }}>JMR</a>
          <p style={{ color: 'var(--mut)', fontSize: 14, maxWidth: 300 }}>Java full-stack developer from Bengaluru, building dependable back ends and smooth front ends.</p>
        </div>
        <div><h4>Explore</h4><a href="#skills">Stack</a><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
        <div><h4>Connect</h4>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${SITE.email}`}>Email</a>
        </div>
        <div><h4>Built with</h4><span style={{ color: 'var(--mut)', fontSize: 14 }}>React · Vite · three.js · Spring Boot · JPA</span></div>
      </div>
      <div className="fb">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>
          <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>↑ Back to top</a> ·{' '}
          <button className="lk" style={{ all: 'unset', cursor: 'pointer' }} onClick={own ? logout : onLogin}>{own ? 'Exit owner mode' : 'Owner login'}</button>
        </span>
      </div>
    </footer>
  );
}
