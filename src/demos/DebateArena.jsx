import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame from "./DemoFrame.jsx";

// Reward weights from the environment (observations.py). Total = weighted mean, renormalised.
const R = [
  ["R1", "Hook strength", 0.12],
  ["R2", "Coherence", 0.1],
  ["R3", "Cultural fit", 0.1],
  ["R4", "Debate resolved", 0.1],
  ["R5", "Defender kept", 0.08],
  ["R6", "Safety", 0.07],
  ["R7", "Originality", 0.07],
  ["R8", "Persona fit", 0.08],
  ["R9", "Platform pacing", 0.08],
  ["R10", "Retention curve", 0.1],
];
const START = [0.42, 1, 0.86, 0, 0.95, 1, 0.82, 0.6, 0.66, 0.55];

const SCRIPT = {
  hook: "Hey guys, so today I wanted to talk about saving money.",
  body: "Every month my salary vanished by the 20th. Then I tried the 50-30-20 rule with one twist: I moved the 20% on payday, before I could see it. Six months later — ₹48,000 saved without feeling it.",
  cta: "Anyway, that's it. Oh, and follow for more.",
};

const CLAIMS = [
  { id: "C1", cls: "hook_weakness", text: "“Hey guys…” burns the 3-second hook window. No promise, no curiosity gap." },
  { id: "C2", cls: "cta_buried", text: "CTA trails off after “Anyway” — the viewer gets no reason to follow." },
  { id: "C3", cls: "pacing_issue", text: "Backstory first; the ₹48,000 payoff only lands at ~20 s. Reorder the body." },
];

const DEFENDER = {
  quote: "I moved the 20% on payday, before I could see it.",
  flag: "C3 would reorder the body around the number and cut the personal payday twist — the most original line in the script.",
};

const OUTCOMES = {
  C1: {
    action: { action_type: "hook_rewrite", target_section: "hook", critique_claim_id: "C1" },
    chain: [
      ["priority", "Hook carries the largest weight and the 0–3 s retention drop; fix it first."],
      ["conflict", "Rewriting the hook does not touch the body, so no conflict with the Defender."],
      ["defender", "Core-strength quote stays verbatim in the body."],
    ],
    section: "hook",
    after: "My salary used to vanish by the 20th. One payday trick saved me ₹48,000.",
    scores: [0.81, 0.93, 0.88, 1, 0.97, 1, 0.84, 1, 0.74, 0.71],
  },
  C2: {
    action: { action_type: "cta_placement", target_section: "cta", critique_claim_id: "C2" },
    chain: [
      ["priority", "CTA is weak, but the hook loses more viewers before they ever reach it."],
      ["conflict", "Safe edit — touches only the last line."],
      ["defender", "Core strength untouched."],
    ],
    section: "cta",
    after: "Follow — tomorrow I'll show the exact app that automates the payday move.",
    scores: [0.42, 0.97, 0.86, 1, 0.95, 1, 0.83, 0.5, 0.79, 0.6],
  },
  C3: {
    action: { action_type: "section_reorder", target_section: "body", critique_claim_id: "C3" },
    chain: [
      ["priority", "Pacing claim looks valid in isolation."],
      ["conflict", "Reorder collides with the Defender's flag on the payday line…"],
      ["defender", "…accepted anyway. This is the trap action."],
    ],
    section: "body",
    after: "₹48,000 saved in six months. Use the 50-30-20 rule. My salary used to vanish by the 20th.",
    scores: [0.44, 0.78, 0.8, 1, 0.41, 1, 0.8, 0.5, 0.83, 0.58],
  },
};

const total = (s) => {
  const w = R.reduce((a, r) => a + r[2], 0);
  return s.reduce((a, v, i) => a + v * R[i][2], 0) / w;
};

function antiGaming(scores) {
  for (let i = 0; i < scores.length; i++) {
    const drop = START[i] - scores[i];
    if (drop > 0.25) return { ok: false, rule: "catastrophic_drop", comp: R[i][0], name: R[i][1], drop };
  }
  return { ok: true };
}

const STAGES = ["Critic", "Defender", "Arbitrator", "Rewriter", "Reward"];

export default function DebateArena() {
  const [stage, setStage] = useState(0);
  const [pick, setPick] = useState(null);

  // auto-advance critic -> defender -> waits for arbitrator
  useEffect(() => {
    if (stage === 0) {
      const t = setTimeout(() => setStage(1), 2200);
      return () => clearTimeout(t);
    }
    if (stage === 1) {
      const t = setTimeout(() => setStage(2), 2400);
      return () => clearTimeout(t);
    }
    if (stage === 3) {
      const t = setTimeout(() => setStage(4), 1700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const choose = (id) => {
    setPick(id);
    setStage(3);
  };
  const reset = () => {
    setPick(null);
    setStage(0);
  };

  const out = pick ? OUTCOMES[pick] : null;
  const verdict = useMemo(() => (out ? antiGaming(out.scores) : null), [out]);
  const tot = out ? (verdict.ok ? total(out.scores) : 0) : null;

  return (
    <DemoFrame
      title="Debate arena · one environment step"
      hint="You are the Arbitrator. Pick which critique to act on."
      note={
        <>
          The flow, agent roles, action schema, reward names, weights and anti-gaming rule (any component dropping more
          than 0.25 below its episode start zeroes the step) mirror the environment code. The script and component
          scores are an illustrative episode, not output from a trained policy — the full GRPO run is still pending.
        </>
      }
    >
      <div className="db-stages">
        {STAGES.map((s, i) => (
          <span key={s} className={`db-stage ${i < stage ? "done" : ""} ${i === stage ? "on" : ""}`}>
            <i>{i + 1}</i>
            {s}
          </span>
        ))}
      </div>

      <div className="db-script">
        {["hook", "body", "cta"].map((sec) => {
          const changed = out && stage >= 3 && out.section === sec;
          return (
            <div key={sec} className={`db-sec ${changed ? "changed" : ""}`}>
              <span className="mono">{sec}</span>
              <p>
                {changed ? (
                  <>
                    <del>{SCRIPT[sec]}</del>
                    <motion.ins initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      {out.after}
                    </motion.ins>
                  </>
                ) : sec === "body" && stage >= 1 ? (
                  <>
                    {SCRIPT.body.split(DEFENDER.quote)[0]}
                    <mark>{DEFENDER.quote}</mark>
                    {SCRIPT.body.split(DEFENDER.quote)[1]}
                  </>
                ) : (
                  SCRIPT[sec]
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="db-agents">
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div className="db-agent critic" key="critic" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="db-agent-h">
                <b>Critic</b>
                <span className="mono">{CLAIMS.length} falsifiable claims</span>
              </div>
              {CLAIMS.map((c, i) => (
                <motion.button
                  key={c.id}
                  className={`db-claim ${pick === c.id ? "picked" : ""} ${stage === 2 ? "pickable" : ""}`}
                  disabled={stage !== 2}
                  onClick={() => choose(c.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.45 }}
                  data-cursor={stage === 2 ? "act on this" : undefined}
                >
                  <span className="mono">
                    {c.id} · {c.cls}
                  </span>
                  {c.text}
                  {c.id === "C3" && stage >= 1 && <em className="db-flag">⚑ Defender objects</em>}
                </motion.button>
              ))}
            </motion.div>
          )}
          {stage >= 1 && (
            <motion.div className="db-agent defender" key="def" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="db-agent-h">
                <b>Defender</b>
                <span className="mono">core_strength_quote</span>
              </div>
              <p>
                Protect: <mark>“{DEFENDER.quote}”</mark>
              </p>
              <p className="db-small">{DEFENDER.flag}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === 2 && (
        <div className="db-call">
          <span className="mono">Your call →</span>
          {CLAIMS.map((c) => (
            <button key={c.id} className="btn btn-neu btn-sm" onClick={() => choose(c.id)}>
              Act on {c.id}
            </button>
          ))}
        </div>
      )}

      {out && stage >= 3 && (
        <motion.div className="db-arb" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="db-chain">
            {out.chain.map(([k, v]) => (
              <div key={k}>
                <span className="mono red">{k}</span>
                <p>{v}</p>
              </div>
            ))}
          </div>
          <pre className="db-json">{JSON.stringify(out.action, null, 2)}</pre>
        </motion.div>
      )}

      {out && stage >= 4 && (
        <motion.div className="db-reward" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="db-bars">
            {R.map(([id, name, w], i) => {
              const v = out.scores[i];
              const dropped = START[i] - v > 0.25;
              return (
                <div key={id} className={`db-bar ${dropped ? "bad" : ""}`} title={`${name} · weight ${w}`}>
                  <span className="mono">{id}</span>
                  <div className="db-track">
                    <i className="db-start" style={{ left: `${START[i] * 100}%` }} />
                    <motion.b initial={{ width: 0 }} animate={{ width: `${v * 100}%` }} transition={{ delay: i * 0.05, duration: 0.8 }} />
                  </div>
                  <span className="mono">{v.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className={`db-total ${verdict.ok ? "" : "zero"}`}>
            <span className="mono">step reward</span>
            <b className="display">{tot.toFixed(3)}</b>
            {verdict.ok ? (
              <span className="mono ok-t">anti-gaming · pass</span>
            ) : (
              <span className="mono">
                ⚠ {verdict.rule}: {verdict.comp} ({verdict.name}) fell {verdict.drop.toFixed(2)} &gt; 0.25 → step zeroed
              </span>
            )}
          </div>
          <button className="btn btn-clay btn-sm" onClick={reset}>
            Run another step ↺
          </button>
        </motion.div>
      )}
    </DemoFrame>
  );
}
