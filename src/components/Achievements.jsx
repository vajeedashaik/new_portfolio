import Reveal from "./Reveal.jsx";
import { achievements } from "../data/content.js";

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <Reveal>
          <span className="section-tag">Recognition</span>
          <h2 className="section-title">Achievements & leadership</h2>
        </Reveal>
        <div className="ach-grid">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="ach-card card">
                {a.year && <span className="yr">{a.year}</span>}
                <h3>{a.title}</h3>
                <p>{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
