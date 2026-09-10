import Reveal from "./Reveal.jsx";
import PhotoCarousel from "./PhotoCarousel.jsx";
import { about, education } from "../data/content.js";

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <span className="section-tag">About</span>
          <h2 className="section-title">ML that ships inside real infrastructure.</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-body" delay={0.05}>
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="edu card">
              <div className="d">{education.degree}</div>
              <div className="s">
                {education.school} · CGPA {education.cgpa} · {education.period}
              </div>
              <div className="m">{education.coursework}</div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <PhotoCarousel
              slides={about.slides}
              intervalMs={about.slideIntervalMs}
            />
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="stats">
            {about.stats.map((s) => (
              <div className="stat card" key={s.label}>
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
