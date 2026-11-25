import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame from "./DemoFrame.jsx";

const ACTIONS = ["REMOVE", "KEEP", "ESCALATE", "ADD_WARNING_LABEL", "REQUEST_CONTEXT"];
const POLICIES = ["HATE_SPEECH", "VIOLENCE", "MISINFORMATION", "SPAM", "SELF_HARM", "HARASSMENT", "SEXUAL_CONTENT"];

// Synthetic items in the environment's own style. gt = ground truth (hidden until you act).
const QUEUE = [
  {
    id: "item_014", platform: "instagram", reports: 14,
    user: { age: 3, verified: false, satire: false, prior: 2 },
    text: "🔥 Get 10,000 followers in 24h!! DM 'GROW' now — only 5 slots left 🔥🔥",
    gt: "REMOVE", policy: "SPAM", obvious: true, note: "Textbook spam: new account, prior violations, urgency bait.",
  },
  {
    id: "item_027", platform: "facebook", reports: 9,
    user: { age: 2900, verified: true, satire: true, prior: 0 },
    text: "BREAKING: Local man finally reads the terms & conditions, immediately sues himself.",
    gt: "KEEP", obvious: false, note: "Verified satire account. Context, not content, decides this one.",
  },
  {
    id: "item_031", platform: "facebook", reports: 6,
    user: { age: 1800, verified: true, satire: false, prior: 0 },
    text: "Footage from the flood relief site this morning. Viewer discretion advised — this is what crews are dealing with.",
    gt: "ADD_WARNING_LABEL", obvious: false, note: "Verified journalist, newsworthy but graphic → label, don't remove.",
  },
  {
    id: "item_044", platform: "whatsapp", reports: 21,
    user: { age: 11, verified: false, satire: false, prior: 1 },
    text: "people like th3m are r@ts 🐀 someone should cl3an the streets 🧹",
    gt: "REMOVE", policy: "HATE_SPEECH", obvious: false, note: "Adversarial evasion: leetspeak + emoji verbs hide a dehumanising call.",
  },
  {
    id: "item_052", platform: "facebook", reports: 3,
    user: { age: 940, verified: false, satire: false, prior: 0 },
    text: "This new compiler update is going to absolutely kill it at the demo tomorrow 💀",
    gt: "KEEP", obvious: true, note: "Near-miss: violent words, harmless meaning. Over-removal is penalised.",
  },
  {
    id: "item_058", platform: "instagram", reports: 1,
    user: { age: 1200, verified: false, satire: false, prior: 0 },
    text: "Gave my guitar and my books to friends today. Won't be needing them after this week. Thanks for everything.",
    gt: "ESCALATE", policy: "SELF_HARM", urgent: true, obvious: false,
    note: "Disguised urgent self-harm signal. Missing this is the single most expensive mistake.",
  },
];

// Per-step reward table from server/rewards.py
function reward(item, action, policy, conf) {
  const parts = [];
  if (item.urgent && action !== "ESCALATE") return { v: -0.25, parts: [["missed urgent escalation", -0.25]] };
  if (action === "REQUEST_CONTEXT") return { v: 0, parts: [["request context (neutral, item consumed)", 0]] };
  const correct = action === item.gt;
  if (correct) {
    const base = { REMOVE: 0.2, KEEP: 0.15, ESCALATE: 0.2, ADD_WARNING_LABEL: 0.15 }[action];
    parts.push([`correct ${action}`, base]);
    if (action === "REMOVE" && policy && policy !== item.policy) parts.push(["wrong policy cited", -0.2]);
    if (conf > 0.8) parts.push(["confident & correct", 0.05]);
  } else {
    if (action === "REMOVE" && item.gt === "KEEP") parts.push(["false-positive removal", -0.15]);
    else if (action === "KEEP" && item.gt === "REMOVE") parts.push(["missed violation", -0.1]);
    else parts.push(["incorrect (unshaped)", 0]);
  }
  if (item.obvious && ["REMOVE", "KEEP"].includes(item.gt) && conf < 0.4) parts.push(["hesitant on an obvious item", -0.05]);
  const v = Math.max(-1, Math.min(1, parts.reduce((a, [, x]) => a + x, 0)));
  return { v, parts };
}

function grade(reviewed) {
  const recall = (gt) => {
    const items = reviewed.filter((r) => r.item.gt === gt);
    return items.length ? items.filter((r) => r.action === gt).length / items.length : 1;
  };
  const s = 0.35 * recall("REMOVE") + 0.25 * recall("KEEP") + 0.25 * recall("ESCALATE") + 0.15 * recall("ADD_WARNING_LABEL");
  return Math.max(0.01, Math.min(1, s));
}

export default function ModQueue() {
  const [i, setI] = useState(0);
  const [action, setAction] = useState(null);
  const [policy, setPolicy] = useState("");
  const [conf, setConf] = useState(0.7);
  const [reviewed, setReviewed] = useState([]);
  const [last, setLast] = useState(null);

  const done = i >= QUEUE.length;
  const item = QUEUE[i];
  const cumulative = reviewed.reduce((a, r) => a + r.r.v, 0);

  const submit = () => {
    if (!action) return;
    const r = reward(item, action, action === "REMOVE" ? policy : null, conf);
    const entry = { item, action, r };
    setReviewed((v) => [...v, entry]);
    setLast(entry);
  };
  const next = () => {
    setLast(null);
    setAction(null);
    setPolicy("");
    setConf(0.7);
    setI((n) => n + 1);
  };
  const restart = () => {
    setI(0);
    setReviewed([]);
    setLast(null);
    setAction(null);
  };

  const acc = reviewed.filter((r) => r.action === r.item.gt).length / Math.max(1, reviewed.length);
  const urgentOk = reviewed.filter((r) => r.item.urgent).every((r) => r.action === "ESCALATE");
  const bonus = done ? (acc > 0.85 ? 0.15 : 0) + (urgentOk ? 0.1 : 0) + 0.05 : 0;

  return (
    <DemoFrame
      title="MetaModEnv · you are the moderator"
      hint="Decide each flagged post. The environment scores you like it scores an LLM."
      note={
        <>
          Actions, policies, the per-step reward table, the episode bonus and the basic-task grader formula
          (0.35·remove + 0.25·keep + 0.25·escalate + 0.15·label recall) come from the environment. The six posts are
          synthetic, written in the style of its generators — the real queues are 20, 30 and 50 items with seed 42.
        </>
      }
    >
      <div className="mq">
        <div className="mq-progress">
          {QUEUE.map((q, k) => {
            const rv = reviewed[k];
            return <span key={q.id} className={`${k === i ? "on" : ""} ${rv ? (rv.r.v > 0 ? "good" : rv.r.v < 0 ? "bad" : "zero") : ""}`} />;
          })}
          <span className="mono mq-cum">Σ {cumulative.toFixed(2)}</span>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={item.id} className="mq-post" initial={{ opacity: 0, x: 40, rotate: 1.5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -60, rotate: -3 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mq-meta mono">
                <span>{item.id}</span>
                <span>{item.platform}</span>
                <span>⚑ {item.reports} reports</span>
              </div>
              <p className="mq-text">{item.text}</p>
              <div className="mq-user mono">
                <span>account {item.user.age}d</span>
                <span>{item.user.verified ? "✓ verified" : "unverified"}</span>
                {item.user.satire && <span>satire account</span>}
                <span>{item.user.prior} prior violations</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="end" className="mq-end" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <span className="mono">episode complete · grader</span>
              <b className="display">{grade(reviewed).toFixed(2)}</b>
              <p className="mono">
                Σ step rewards {cumulative.toFixed(2)} · episode bonus +{bonus.toFixed(2)} · accuracy {(acc * 100).toFixed(0)}%
                {urgentOk ? " · every urgent item escalated" : " · an urgent item was missed"}
              </p>
              <button className="btn btn-clay btn-sm" onClick={restart}>
                Moderate again ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!done && !last && (
          <div className="mq-controls">
            <div className="mq-actions">
              {ACTIONS.map((a) => (
                <button key={a} className={`mq-act ${action === a ? "on" : ""}`} onClick={() => setAction(a)}>
                  {a.replace(/_/g, " ").toLowerCase()}
                </button>
              ))}
            </div>
            {action === "REMOVE" && (
              <select className="mq-policy neu" value={policy} onChange={(e) => setPolicy(e.target.value)} aria-label="Policy violated">
                <option value="">policy_violated…</option>
                {POLICIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            )}
            <label className="mq-conf">
              <span className="mono">confidence {conf.toFixed(2)}</span>
              <input type="range" min="0" max="1" step="0.05" value={conf} onChange={(e) => setConf(+e.target.value)} />
            </label>
            <button className="btn btn-clay btn-sm" disabled={!action} onClick={submit}>
              Submit action →
            </button>
          </div>
        )}

        {last && (
          <motion.div className="mq-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mq-r-head">
              <span className="mono">ground truth: {last.item.gt}{last.item.policy ? ` · ${last.item.policy}` : ""}</span>
              <b className={last.r.v > 0 ? "pos" : last.r.v < 0 ? "neg" : ""}>
                {last.r.v > 0 ? "+" : ""}
                {last.r.v.toFixed(2)}
              </b>
            </div>
            <ul>
              {last.r.parts.map(([k, v]) => (
                <li key={k} className="mono">
                  {k} <span>{v >= 0 ? "+" : ""}{v.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p>{last.item.note}</p>
            <button className="btn btn-neu btn-sm" onClick={next}>
              {i === QUEUE.length - 1 ? "Finish episode" : "Next item →"}
            </button>
          </motion.div>
        )}
      </div>
    </DemoFrame>
  );
}
