import Reveal from "./Reveal.jsx";
import { profile } from "../data/content.js";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal>
          <span className="section-tag" style={{ justifyContent: "center", display: "flex" }}>
            Contact
          </span>
          <h2>
            Let's build something <span className="gradient-text">reliable</span>.
          </h2>
          <p>
            Open to internships and new-grad roles in ML engineering, cloud, and data.
            Fastest way to reach me is email.
          </p>
          <div className="contact-actions">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
