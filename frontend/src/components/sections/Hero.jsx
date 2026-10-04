import photo from "../../assets/images/profile.jpg";
import { useData } from "../../context/DataContext";
import useTypewriter from "../../hooks/useTypewriter";
import Counter from "../ui/Counter";

const ROLES = [
  "Java Full-Stack Developer",
  "MERN Stack Developer",
  "Backend Developer",
];

export default function Hero({ onResume }) {
  const {
    projects: [projects],
    experience: [experience],
    skills: [skills],
    ach: [ach],
  } = useData();
  const role = useTypewriter(ROLES);
  const skillCount = skills.reduce((n, c) => n + c.items.length, 0);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.firstChild.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;
  };

  return (
    <section className="hero" id="home">
      <div>
        <span className="tag">
          ● Open to work · JAVA/MERN Full-Stack · Pan-India
        </span>
        <h1>
          <span className="nm">
            Hi👋, I'm <span className="grad">Jaganmohan Reddy</span>
          </span>
        </h1>
        <h3 className="sg grad" style={{ fontSize: 24, minHeight: 36 }}>
          {role}
          <span style={{ color: "var(--b)" }}>|</span>
        </h3>

        <p className="lead">
          ECE graduate (2026). I{" "}
          <b>diagnosed and fixed a real race condition</b> in a booking engine,
          tested APIs across two internships, and{" "}
          <b>practice Java full-stack every day</b> in public on GitHub and
          LinkedIn.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn" href="#projects">
            View Projects
          </a>
          <button className="btn g" onClick={onResume}>
            Resume
          </button>
          <a className="btn g" href="#contact">
            Hire Me
          </a>
        </div>
        <div className="stats">
          <div>
            <b>
              <Counter to={projects.length} />+
            </b>
            <span>Projects</span>
          </div>
          <div>
            <b>
              <Counter to={experience.length} />
            </b>
            <span>Experiences</span>
          </div>
          <div>
            <b>
              <Counter to={skillCount} />+
            </b>
            <span>Skills</span>
          </div>
          <div>
            <b>
              <Counter to={ach.length} />
            </b>
            <span>Certificates &amp; papers</span>
          </div>
        </div>
      </div>
      <div
        className="stage"
        onMouseMove={onMove}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.style.transform = "";
        }}
      >
        <div className="photo">
          <div className="rings">
            <i />
            <i />
            <i />
          </div>
          <img src={photo} alt="Jaganmohan Reddy" />
          <span className="chip c1 grad">Java</span>
          <span className="chip c2" style={{ color: "var(--b)" }}>
            React
          </span>
          <span className="chip c3" style={{ color: "var(--c)" }}>
            MySQL
          </span>
        </div>
      </div>
    </section>
  );
}
