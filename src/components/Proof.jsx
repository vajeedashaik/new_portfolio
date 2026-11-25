import { useRef } from "react";
import { proof } from "../data/site.js";
import { useCountUp, useInView } from "../lib/motion.js";

const STATUS_TEXT = {
  measured: "Measured",
  counted: "Counted from repos",
  design: "System design",
  verified: "Verified live",
  award: "Recognition",
};

function Token({ item, i, run }) {
  const n = useCountUp(item.value, run, { decimals: item.decimals, duration: 1.8 + i * 0.1 });
  const card = useRef(null);
  const tilt = (e) => {
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
    card.current.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    card.current.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const reset = () => (card.current.style.transform = "");
  const red = i % 3 === 0;
  return (
    <article
      ref={card}
      className={`token ${red ? "clay" : "clay-white"}`}
      onPointerMove={tilt}
      onPointerLeave={reset}
      data-rv
      data-cursor="tilt"
    >
      <div className="token-top">
        <span className="mono">{item.tag}</span>
        <span className={`token-status mono ${item.status}`}>{STATUS_TEXT[item.status]}</span>
      </div>
      <div className="token-num display">
        {n}
        {item.suffix && <span className="token-suf">{item.suffix}</span>}
      </div>
      <p>{item.label}</p>
      <span className="token-glare" />
    </article>
  );
}

export default function Proof() {
  const [ref, seen] = useInView();
  return (
    <section className="proof" id="proof" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <span className="idx">(00)</span>
          <h2 data-split>
            <span className="ln">
              <span>Proof,</span>
            </span>
            <span className="ln">
              <span className="red">not adjectives.</span>
            </span>
          </h2>
          <p>
            Every number on this page is traceable to a repo, a notebook or a paper — and tagged with how it was obtained.
            Simulated stays labelled simulated.
          </p>
        </div>
        <div className="token-grid">
          {proof.map((p, i) => (
            <Token key={p.label} item={p} i={i} run={seen} />
          ))}
        </div>
      </div>
    </section>
  );
}
