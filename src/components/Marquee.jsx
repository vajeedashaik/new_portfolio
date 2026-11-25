import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "../lib/motion.js";

const WORDS = [
  "Reinforcement learning",
  "Multi-agent LLMs",
  "Reward design",
  "Computer vision",
  "Stacked ensembles",
  "Evaluation",
  "MCP servers",
  "GRPO",
];

function Row({ reverse }) {
  return (
    <div className="mq-track" data-rev={reverse ? "1" : "0"}>
      {[0, 1].map((k) => (
        <div className="mq-seq" key={k} aria-hidden={k === 1}>
          {WORDS.map((w) => (
            <span key={w} className="mq-item">
              {w}
              <span className="mq-star">✺</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two counter-scrolling bands whose speed reacts to scroll velocity. */
export default function Marquee() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const tracks = root.current.querySelectorAll(".mq-track");
    const state = [...tracks].map((t) => ({ el: t, x: 0, w: t.firstChild.offsetWidth, dir: t.dataset.rev === "1" ? 1 : -1 }));
    let boost = 0;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        boost = Math.min(Math.abs(self.getVelocity()) / 220, 14);
      },
    });
    const onResize = () => state.forEach((s) => (s.w = s.el.firstChild.offsetWidth));
    window.addEventListener("resize", onResize);
    const tick = (_, dt) => {
      boost *= 0.92;
      state.forEach((s) => {
        s.x += s.dir * (0.045 + boost * 0.02) * dt;
        if (s.x <= -s.w) s.x += s.w;
        if (s.x >= 0) s.x -= s.w;
        s.el.style.transform = `translate3d(${s.x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="marquee" ref={root} aria-label="Focus areas">
      <div className="mq-band mq-red clay">
        <Row />
      </div>
      <div className="mq-band mq-ink">
        <Row reverse />
      </div>
    </div>
  );
}
