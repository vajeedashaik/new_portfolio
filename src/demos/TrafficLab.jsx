import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame from "./DemoFrame.jsx";
import { paper } from "../data/site.js";

const CLASSES = [
  ["Low", "0–1,000 veh/h"],
  ["Medium", "1,001–2,500"],
  ["High", "2,501–4,500"],
  ["Severe", "4,501–7,280"],
];
// rows = actual, cols = predicted (7,128 held-out rows) — model_comparison.json
const CM = [
  [1622, 27, 0, 0],
  [39, 859, 80, 0],
  [1, 76, 1862, 121],
  [0, 1, 111, 2430],
];
const F1 = [98.0, 88.5, 90.5, 95.4];

const IMPORTANCE = [
  ["traffic_lag_1h", 36.4, "lag"],
  ["hour_cos", 21.9, "time"],
  ["hour", 15.3, "time"],
  ["day_of_week", 6.6, "time"],
  ["hour_sin", 2.5, "time"],
  ["traffic_rolling_3h", 1.7, "lag"],
  ["traffic_rolling_6h", 1.4, "lag"],
  ["all 8 weather features", 0.9, "weather"],
];

const MODELS = [
  ["HistGradientBoosting", 93.69, 0.9368, 5.0, true],
  ["Random Forest", 92.54, 0.9259, 4.4, false],
  ["Extra Trees", 91.06, 0.9111, 2.1, false],
];

const TABS = [
  ["cm", "Confusion matrix"],
  ["fi", "What it listens to"],
  ["bo", "Model bake-off"],
];

function Matrix() {
  const [hover, setHover] = useState(null);
  const [norm, setNorm] = useState(true);
  const rowSum = CM.map((r) => r.reduce((a, b) => a + b, 0));
  const val = (r, c) => (norm ? CM[r][c] / rowSum[r] : CM[r][c] / 2430);
  const h = hover && { a: CLASSES[hover[0]][0], p: CLASSES[hover[1]][0], n: CM[hover[0]][hover[1]], pct: (CM[hover[0]][hover[1]] / rowSum[hover[0]]) * 100 };
  return (
    <div className="tl-cm">
      <div className="tl-cm-grid">
        <span />
        {CLASSES.map(([c]) => (
          <span key={c} className="mono tl-ax">
            pred {c}
          </span>
        ))}
        {CM.map((row, r) => (
          <div key={r} className="tl-cm-row">
            <span className="mono tl-ax">{CLASSES[r][0]}</span>
            {row.map((n, c) => {
              const v = val(r, c);
              return (
                <motion.button
                  key={c}
                  className={`tl-cell ${r === c ? "diag" : ""}`}
                  style={{ "--v": Math.min(1, v), color: v > 0.5 ? "#fff" : undefined }}
                  onPointerEnter={() => setHover([r, c])}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover([r, c])}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (r * 4 + c) * 0.03 }}
                >
                  {norm ? `${(v * 100).toFixed(v < 0.01 && n > 0 ? 1 : 0)}%` : n.toLocaleString()}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="tl-cm-side">
        <div className="ev-toggle neu small">
          <button className={norm ? "on" : ""} onClick={() => setNorm(true)}>
            row %
          </button>
          <button className={!norm ? "on" : ""} onClick={() => setNorm(false)}>
            counts
          </button>
        </div>
        <p className="tl-read">
          {h ? (
            <>
              Actual <b>{h.a}</b> predicted as <b>{h.p}</b>: {h.n.toLocaleString()} rows ({h.pct.toFixed(1)}% of {h.a}).
            </>
          ) : (
            <>Hover a cell. Note the corners: zero Low↔Severe confusions — every error is an adjacent tier.</>
          )}
        </p>
        <div className="tl-f1">
          {CLASSES.map(([c], i) => (
            <div key={c}>
              <span className="mono">F1 {c}</span>
              <b>{F1[i].toFixed(1)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Importance() {
  const [group, setGroup] = useState(null);
  return (
    <div className="tl-fi">
      <div className="tl-fi-toggle">
        {[
          ["lag", "Recent traffic"],
          ["time", "Time of day / week"],
          ["weather", "Weather"],
        ].map(([g, l]) => (
          <button key={g} className={`chip ${group === g ? "on" : ""}`} onPointerEnter={() => setGroup(g)} onPointerLeave={() => setGroup(null)} onClick={() => setGroup(group === g ? null : g)}>
            {l}
          </button>
        ))}
      </div>
      {IMPORTANCE.map(([f, v, g], i) => (
        <div key={f} className={`tl-bar ${group && group !== g ? "dim" : ""} ${g}`}>
          <span className="mono">{f}</span>
          <div className="tl-track">
            <motion.b initial={{ width: 0 }} animate={{ width: `${(v / 36.4) * 100}%` }} transition={{ delay: i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <span className="mono">{g === "weather" ? "<1%" : `${v}%`}</span>
        </div>
      ))}
      <p className="tl-read">
        Permutation importance (5 repeats, weighted-F1 scoring). Lag + time-of-day carry ≈76% of the signal;{" "}
        <b>every weather feature combined carries under 1%</b> — I-94 congestion is a clock, not a forecast.
      </p>
    </div>
  );
}

function BakeOff() {
  return (
    <div className="tl-bo">
      {MODELS.map(([n, acc, f1, t, win], i) => (
        <div key={n} className={`tl-model ${win ? "win clay" : "clay-white"}`}>
          <span className="mono">{win ? "selected · best weighted F1" : "runner-up"}</span>
          <b>{n}</b>
          <div className="tl-model-row">
            <div>
              <span className="mono">accuracy</span>
              <motion.i initial={{ width: 0 }} animate={{ width: `${(acc - 90) * 25}%` }} transition={{ delay: i * 0.1, duration: 0.9 }} />
              <em>{acc}%</em>
            </div>
            <div>
              <span className="mono">weighted F1</span>
              <em>{f1}</em>
            </div>
            <div>
              <span className="mono">train</span>
              <em>{t}s CPU</em>
            </div>
          </div>
        </div>
      ))}
      <p className="tl-read mono">accuracy bars start at 90% to make a 2.6-point spread visible</p>
    </div>
  );
}

export default function TrafficLab() {
  const [tab, setTab] = useState("cm");
  return (
    <DemoFrame
      title="ForgeML · inside the congestion model"
      hint="Explore the real evaluation: 7,128 held-out hours, four congestion tiers."
      note={
        <>
          Every number here is from the trained model's saved evaluation (model_comparison.json, feature_importance.csv).
          Caveat I'd raise myself: the split is random-stratified, so adjacent hours leak across train/test — a temporal
          split is the honest next benchmark.
        </>
      }
    >
      <div className="tl-classes">
        {CLASSES.map(([c, r], i) => (
          <span key={c} className={`tl-class c${i}`}>
            <b>{c}</b>
            <small className="mono">{r}</small>
          </span>
        ))}
      </div>
      <div className="tl-tabs neu">
        {TABS.map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div className="tl-panel">
        {tab === "cm" && <Matrix />}
        {tab === "fi" && <Importance />}
        {tab === "bo" && <BakeOff />}
      </div>
      <a className="tl-paper clay" href={paper.url} target="_blank" rel="noreferrer" data-cursor="ieee xplore">
        <span className="mono">IEEE ICAFT 2025 · first author</span>
        <b className="serif">{paper.title}</b>
        <span className="mono">DOI {paper.doi} ↗</span>
      </a>
    </DemoFrame>
  );
}
