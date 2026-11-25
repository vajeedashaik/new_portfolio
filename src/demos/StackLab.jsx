import { useEffect, useState } from "react";
import { motion } from "motion/react";
import DemoFrame from "./DemoFrame.jsx";

// 5-fold CV RMSE on logerror (training notebook)
const BASE = [
  { id: "ridge", n: "Ridge", rmse: 0.0791, role: "baseline", inStack: false },
  { id: "et", n: "ExtraTrees", rmse: 0.0763, role: "baseline", inStack: false },
  { id: "xgb", n: "XGBoost", rmse: 0.0754, role: "base learner", inStack: true },
  { id: "cat", n: "CatBoost", rmse: 0.0751, role: "base learner", inStack: true },
  { id: "lgb", n: "LightGBM", rmse: 0.0749, role: "base learner · Optuna 20 trials", inStack: true },
];
const STACK = 0.0742;

const FEATURES = [
  ["property_age", "year built → age at sale"],
  ["tax_ratio", "structure tax ÷ total tax"],
  ["structure_land_ratio", "building vs land value"],
  ["living_area_ratio", "finished ÷ lot area"],
  ["month_sin / cos", "cyclical sale month"],
  ["geo_cluster", "KMeans k=25 on lat/lon"],
  ["geo_cluster_density", "listings per cluster"],
  ["cluster_mean_tax", "neighbourhood tax level"],
  ["geo_cluster_te", "5-fold target encoding"],
  ["county_te", "5-fold target encoding"],
  ["age_cluster_interaction", "age × neighbourhood"],
];

const COUNTY = [
  ["Los Angeles", 0.0142],
  ["Orange", -0.0089],
  ["Ventura", 0.0031],
];

export default function StackLab() {
  const [fold, setFold] = useState(-1);
  const [hover, setHover] = useState(null);
  const running = fold >= 0 && fold < 5;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setFold((f) => f + 1), 750);
    return () => clearTimeout(t);
  }, [fold, running]);

  const min = 0.073, max = 0.08;
  const pos = (v) => ((max - v) / (max - min)) * 100;
  const stackReady = fold >= 5;

  return (
    <DemoFrame
      title="PriceLens · how the stack beats every model in it"
      hint="Run the 5-fold out-of-fold pass, then watch the meta-learner blend."
      note={
        <>
          RMSE values, features and county errors are from the training notebook's 5-fold CV. The meta-model only ever
          sees out-of-fold predictions, so no base learner grades its own homework. (The project's public site runs a
          lightweight approximation for live predictions; this panel shows the real model's results.)
        </>
      }
    >
      <div className="sl">
        <div className="sl-flow">
          <div className="sl-col">
            {BASE.filter((b) => b.inStack).map((b) => (
              <div key={b.id} className={`sl-model clay-white ${hover === b.id ? "hl" : ""}`} onPointerEnter={() => setHover(b.id)} onPointerLeave={() => setHover(null)}>
                <b>{b.n}</b>
                <span className="mono">{b.rmse.toFixed(4)}</span>
              </div>
            ))}
          </div>

          <div className="sl-folds">
            <span className="mono">out-of-fold predictions</span>
            <div className="sl-fold-row">
              {[0, 1, 2, 3, 4].map((k) => (
                <span key={k} className={`sl-fold ${fold === k ? "hold" : fold > k ? "done" : ""}`}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <i key={j} className={j === k ? "h" : ""} />
                  ))}
                </span>
              ))}
            </div>
            <svg className="sl-wires" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
              {[10, 30, 50].map((y, i) => (
                <path key={y} d={`M0 ${y} C 40 ${y}, 60 30, 100 30`} className={stackReady ? "live" : ""} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </svg>
            <button className="btn btn-clay btn-sm" onClick={() => setFold(0)} disabled={running}>
              {stackReady ? "Re-run 5-fold ↺" : running ? `fold ${fold + 1}/5…` : "Run 5-fold OOF ▸"}
            </button>
          </div>

          <motion.div className={`sl-meta ${stackReady ? "clay" : "clay-white"}`} animate={{ scale: stackReady ? 1.04 : 1 }}>
            <span className="mono">Ridge meta-model</span>
            <b className="display">{stackReady ? STACK.toFixed(4) : "—"}</b>
            <span className="mono">{stackReady ? "CV RMSE · best" : "waiting for OOF"}</span>
          </motion.div>
        </div>

        <div className="sl-board">
          <div className="sl-axis mono">
            <span>worse</span>
            <span>RMSE on log-error (axis 0.073–0.080)</span>
            <span>better</span>
          </div>
          <div className="sl-rail">
            {BASE.map((b) => (
              <button
                key={b.id}
                className={`sl-dot ${b.inStack ? "in" : ""} ${hover === b.id ? "hl" : ""}`}
                style={{ left: `${pos(b.rmse)}%` }}
                onPointerEnter={() => setHover(b.id)}
                onPointerLeave={() => setHover(null)}
                aria-label={`${b.n} ${b.rmse}`}
              >
                <span className="sl-dot-l mono">
                  {b.n} {b.rmse.toFixed(4)}
                </span>
              </button>
            ))}
            <motion.span className="sl-dot star" style={{ left: `${pos(STACK)}%` }} animate={{ scale: stackReady ? 1.25 : 0.85, opacity: stackReady ? 1 : 0.35 }}>
              <span className="sl-dot-l mono">stack {STACK}</span>
            </motion.span>
          </div>
        </div>

        <div className="sl-bottom">
          <div className="sl-feats">
            <span className="mono red">engineered features</span>
            <div>
              {FEATURES.map(([f, d]) => (
                <span key={f} className="chip" title={d} data-cursor={d}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="sl-county">
            <span className="mono red">mean log-error by county</span>
            {COUNTY.map(([c, v]) => (
              <div key={c} className="sl-cbar">
                <span className="mono">{c}</span>
                <div className="sl-ctrack">
                  <motion.i
                    className={v > 0 ? "over" : "under"}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(Math.abs(v) / 0.0142) * 50}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
                <span className="mono">
                  {v > 0 ? "+" : ""}
                  {v.toFixed(4)}
                </span>
              </div>
            ))}
            <small className="mono">+ Zillow overestimates · − underestimates</small>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
