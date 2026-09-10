import { profile } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with React + Vite</span>
        <span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>{" "}
          ·{" "}
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </span>
      </div>
    </footer>
  );
}
