import { motion } from "framer-motion";
import { profile } from "../data/content.js";
import IntroVideo from "./IntroVideo.jsx";

const item = {
  hidden: { opacity: 0, y: 26 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-orb a" />
      <div className="hero-orb b" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-hi" custom={0} variants={item} initial="hidden" animate="show">
            {"// hello, I'm"}
          </motion.p>
          <motion.h1 custom={1} variants={item} initial="hidden" animate="show">
            {profile.name.split(" ")[0]}{" "}
            <span className="gradient-text">{profile.name.split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <motion.p className="hero-role" custom={2} variants={item} initial="hidden" animate="show">
            {profile.title}
          </motion.p>
          <motion.p className="hero-tagline" custom={3} variants={item} initial="hidden" animate="show">
            {profile.tagline}
          </motion.p>
          <motion.div className="hero-actions" custom={4} variants={item} initial="hidden" animate="show">
            <a className="btn btn-primary" href="#projects">
              View projects
            </a>
            <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Download résumé
            </a>
          </motion.div>
          <motion.div className="hero-socials" custom={5} variants={item} initial="hidden" animate="show">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <span>{profile.location}</span>
          </motion.div>
        </div>

        {profile.introVideo && (
          <motion.div
            className="hero-media"
            custom={3}
            variants={item}
            initial="hidden"
            animate="show"
          >
            <IntroVideo src={profile.introVideo} />
          </motion.div>
        )}
      </div>
      <div className="hero-scroll">scroll ↓</div>
    </header>
  );
}
