import Reveal from "./Reveal.jsx";
import { experience } from "../data/content.js";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <Reveal>
          <span className="section-tag">Experience</span>
          <h2 className="section-title">Where I've worked</h2>
        </Reveal>
        <div className="exp-list">
          {experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 0.06}>
              <article className="exp-item card">
                <div className="period">{e.period}</div>
                <div>
                  <h3>{e.company}</h3>
                  <div className="role">{e.role}</div>
                  <div className="proj">{e.project}</div>
                  <ul>
                    {e.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
