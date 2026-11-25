import { education, experience, paper, recognition } from "../data/site.js";
import { scrollToId } from "../lib/motion.js";

export default function Journey() {
  return (
    <section className="journey" id="journey">
      <div className="wrap">
        <div className="section-head">
          <span className="idx">(03)</span>
          <h2 data-split>
            <span className="ln">
              <span>Published,</span>
            </span>
            <span className="ln">
              <span className="red">placed, shipped.</span>
            </span>
          </h2>
        </div>

        <a className="paper-card clay" href={paper.url} target="_blank" rel="noreferrer" data-rv data-cursor="read on ieee xplore">
          <div className="paper-left">
            <span className="mono">IEEE Xplore · {paper.venue}</span>
            <h3 className="serif">{paper.title}</h3>
            <p className="paper-authors">
              <b>Shaik Vajeeda</b>
              {paper.authors.replace("Shaik Vajeeda", "")}
            </p>
          </div>
          <div className="paper-right">
            <span className="paper-badge display">1st</span>
            <span className="mono">author</span>
            <span className="mono paper-doi">DOI {paper.doi} ↗</span>
          </div>
        </a>

        <div className="jr-grid">
          <div className="jr-col">
            <span className="mono red jr-label">Experience</span>
            {experience.map((x) => (
              <article key={x.org} className="jr-item glass" data-rv>
                <div className="jr-top">
                  <b>{x.org}</b>
                  <span className="mono">{x.period}</span>
                </div>
                <span className="jr-role">{x.role}</span>
                <p>{x.text}</p>
                {x.link && (
                  <button className="jr-link mono" onClick={() => scrollToId(x.link.slice(1))} data-cursor="see it running">
                    ↳ Try the system from this internship
                  </button>
                )}
              </article>
            ))}
            <article className="jr-item glass jr-edu" data-rv>
              <div className="jr-top">
                <b>{education.school}</b>
                <span className="mono">{education.period}</span>
              </div>
              <span className="jr-role">{education.degree}</span>
              <div className="jr-cgpa">
                <span className="display">{education.cgpa}</span>
                <span className="mono">CGPA / 10</span>
              </div>
            </article>
          </div>

          <div className="jr-col">
            <span className="mono red jr-label">Recognition</span>
            <ul className="jr-rec">
              {recognition.map((r) => (
                <li key={r.v} data-rv>
                  <span className="mono">{r.k}</span>
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer">
                      {r.v} ↗
                    </a>
                  ) : (
                    <p>{r.v}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
