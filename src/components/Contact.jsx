import { useRef, useState } from "react";
import { profile } from "../data/site.js";
import { gsap } from "../lib/motion.js";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const blob = useRef(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(blob.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 1.1, ease: "power3" });
  };

  return (
    <section className="contact" id="contact" onPointerMove={move}>
      <div className="contact-blob" ref={blob} aria-hidden="true" />
      <div className="wrap contact-inner">
        <span className="mono contact-k">(04) · {profile.availability}</span>
        <h2 className="display contact-h" data-split>
          <span className="ln">
            <span>Let's build</span>
          </span>
          <span className="ln">
            <span>something</span>
          </span>
          <span className="ln">
            <span className="serif contact-it">that learns.</span>
          </span>
        </h2>
        <div className="contact-actions">
          <button className="contact-mail glass-dark" onClick={copy} data-cursor="copy">
            <span className="mono">{copied ? "copied to clipboard ✓" : "email · click to copy"}</span>
            <b>{profile.email}</b>
          </button>
          <div className="contact-links">
            <a className="btn contact-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span className="arr">↗</span>
            </a>
            <a className="btn contact-btn" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <span className="arr">↗</span>
            </a>
            <a className="btn contact-btn" href={profile.resume} target="_blank" rel="noreferrer">
              Résumé <span className="arr">↗</span>
            </a>
          </div>
        </div>
        <footer className="foot mono">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Designed & built by me · React · Three.js · GSAP</span>
          <span>{profile.location}</span>
        </footer>
      </div>
    </section>
  );
}
