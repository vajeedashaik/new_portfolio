import { useEffect, useRef, useState } from "react";
import { profile } from "../data/site.js";
import { scrollToId } from "../lib/motion.js";

const LINKS = [
  ["Systems", "work"],
  ["Stack", "stack"],
  ["Journey", "journey"],
  ["Contact", "contact"],
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 240 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${hidden && !open ? "nav-hidden" : ""}`}>
      <nav className="nav-pill glass" aria-label="Primary">
        <a href="#top" className="nav-logo" onClick={go("top")} aria-label="Back to top">
          <span className="nav-orb clay" />
          <span className="nav-name">Shaik Vajeeda</span>
        </a>
        <div className="nav-links">
          {LINKS.map(([l, id]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {l}
            </a>
          ))}
        </div>
        <a className="btn btn-clay btn-sm nav-cta" href={profile.resume} target="_blank" rel="noreferrer" data-cursor="open pdf">
          Résumé <span className="arr">↗</span>
        </a>
        <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
        </button>
        <span className="nav-progress" ref={bar} />
      </nav>
      {open && (
        <div className="nav-sheet glass">
          {LINKS.map(([l, id]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {l}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
        </div>
      )}
    </header>
  );
}
