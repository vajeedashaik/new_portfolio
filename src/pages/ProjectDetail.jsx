import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { getProject } from "../data/content.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);

  if (!p) {
    return (
      <div className="grain">
        <Nav />
        <div className="detail container">
          <Link to="/" className="back">
            ← Back
          </Link>
          <h1>Not found</h1>
          <p className="aka">No project matches “{slug}”.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="grain">
      <Nav />
      <motion.div
        className="detail"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <Link to="/#projects" className="back">
            ← All projects
          </Link>
          <span className="yr">{p.year}</span>
          <h1>{p.name}</h1>
          <div className="aka">{p.aka}</div>

          {p.links.length > 0 && (
            <div className="detail-links">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  className="btn btn-primary"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          {p.metrics.length > 0 && (
            <div className="detail-metrics">
              {p.metrics.map((m) => (
                <div className="m card" key={m.label}>
                  <div className="v">{m.value}</div>
                  <div className="l">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="detail-section">
            <h2>Problem</h2>
            <p>{p.problem}</p>
          </div>

          <div className="detail-section">
            <h2>Approach</h2>
            <ul>
              {p.approach.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h2>Result</h2>
            <p>{p.result}</p>
          </div>

          <div className="detail-section">
            <h2>Stack</h2>
            <div className="detail-stack">
              {p.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
