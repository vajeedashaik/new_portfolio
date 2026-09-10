import Reveal from "./Reveal.jsx";
import { skills } from "../data/content.js";
import { TECH_ICONS } from "../data/techIcons.js";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal>
          <span className="section-tag">Stack</span>
          <h2 className="section-title">Tools I build with</h2>
        </Reveal>
        <div className="skills-grid">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06}>
              <div className="skill-card card">
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((it) => {
                    const src = it.i && TECH_ICONS[it.i];
                    return (
                      <li key={it.n} className={src ? "has-icon" : undefined}>
                        {src && <img src={src} alt="" aria-hidden="true" />}
                        {it.n}
                      </li>
                    );
                  })}
                </ul>
                {g.note && <p className="skill-note">{g.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
