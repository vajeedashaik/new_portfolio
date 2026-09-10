import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import { featuredProjects, secondaryProjects } from "../data/content.js";

export default function Projects() {
  const navigate = useNavigate();
  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal>
          <span className="section-tag">Work</span>
          <h2 className="section-title">Selected projects</h2>
        </Reveal>

        <div className="proj-featured">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <article
                className="proj-card card"
                onClick={() => navigate(`/projects/${p.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/projects/${p.slug}`)}
              >
                <div>
                  <span className="idx">
                    {String(i + 1).padStart(2, "0")} — {p.year}
                  </span>
                  <h3>{p.name}</h3>
                  <div className="aka">{p.aka}</div>
                  <p className="blurb">{p.blurb}</p>
                  <div className="proj-tags">
                    {p.tags.slice(0, 6).map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="proj-arrow">Case study →</span>
                </div>
                {p.metrics.length > 0 && (
                  <div className="proj-metrics">
                    {p.metrics.map((m) => (
                      <div className="m" key={m.label}>
                        <div className="v">{m.value}</div>
                        <div className="l">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05}>
          <div className="proj-secondary">
            {secondaryProjects.map((p) => (
              <article
                className="proj-mini card"
                key={p.slug}
                onClick={() => navigate(`/projects/${p.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/projects/${p.slug}`)}
              >
                <h4>{p.name}</h4>
                <div className="aka">{p.aka}</div>
                <p className="blurb">{p.blurb}</p>
                <div className="proj-tags">
                  {p.tags.slice(0, 4).map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
