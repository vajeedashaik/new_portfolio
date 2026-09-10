import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile } from "../data/content.js";

const LINKS = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Achievements", "achievements"],
  ["Contact", "contact"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="/" className="nav-logo" onClick={go("top")}>
          <span className="dot" />
          Vajeeda Shaik
        </a>
        <div className="nav-links">
          {LINKS.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {label}
            </a>
          ))}
          <a className="nav-cta" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
        <button className="nav-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {LINKS.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {label}
            </a>
          ))}
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      )}
    </nav>
  );
}
