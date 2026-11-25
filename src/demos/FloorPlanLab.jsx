import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import DemoFrame from "./DemoFrame.jsx";

const CV_STAGES = [
  ["preprocess", "denoise · CLAHE · threshold · deskew", true],
  ["wall_detection", "morphology → HoughLinesP → merge", true],
  ["ocr", "dimension text (stub)", false],
  ["object_detection", "door arcs · openings", false],
  ["room_detection", "flood-fill enclosed regions", false],
  ["calibration", "no dimension text → mm_per_pixel = null", false],
  ["semantic_assembly", "lexicon → RoomType enum", true],
  ["artifacts", "overlay PNG · semantic_model.json", false],
];
const EDIT_STAGES = ["parse", "schema", "entities", "semantic", "geometry", "constraints", "commit"];

const X0 = 40, X1 = 560, Y0 = 40, Y1 = 340;

const INITIAL = {
  p: 260,
  doors: [
    { id: "d1", wall: "w5", c: 190 },
    { id: "d2", wall: "w3", c: 430 },
    { id: "d3", wall: "w4", c: 120 },
    { id: "d4", wall: "w1", c: 150 },
  ],
  windows: [
    { id: "win1", wall: "w1", c: 440 },
    { id: "win2", wall: "w2", c: 210 },
  ],
};

const wallGeom = (w, p) =>
  ({
    w1: [X0, Y0, X1, Y0],
    w2: [X1, Y0, X1, Y1],
    w3: [X1, Y1, X0, Y1],
    w4: [X0, Y1, X0, Y0],
    w5: [p, Y0, p, Y1],
  })[w];
const isVertical = (w) => w === "w2" || w === "w4" || w === "w5";

function openingXY(o, p) {
  const [x1, y1] = wallGeom(o.wall, p);
  return isVertical(o.wall) ? [x1, o.c] : [o.c, y1];
}
function roomOf(o, p) {
  if (o.wall === "w5") return "both";
  const [x] = openingXY(o, p);
  return x < p ? "kitchen" : "living";
}

const PRESETS = [
  "delete the door",
  "move the wall between the kitchen and living room 60 px right",
  "move that wall 500 mm left",
  "delete the window in the living room",
  "move the partition 220 px left",
  "add a skylight",
];

// --- tiny offline grammar: text -> typed command (or a typed failure) ---
function interpret(text, model) {
  const t = text.toLowerCase().trim();
  const fail = (stage, msg) => ({ ok: false, stage, msg });
  if (!t) return fail("parse", "Empty instruction.");

  const del = t.match(/\b(delete|remove)\b.*\b(door|window)s?\b/);
  if (del) {
    const kind = del[2];
    const list = kind === "door" ? model.doors : model.windows;
    const idm = t.match(/\b(d\d|win\d)\b/);
    let cands = list;
    if (idm) cands = list.filter((o) => o.id === idm[1]);
    else if (/kitchen/.test(t)) cands = list.filter((o) => ["kitchen", "both"].includes(roomOf(o, model.p)));
    else if (/living/.test(t)) cands = list.filter((o) => ["living", "both"].includes(roomOf(o, model.p)));
    if (cands.length === 0) return fail("entities", `No ${kind} matches that description.`);
    if (cands.length > 1)
      return { ok: false, stage: "entities", clarify: true, kind, ids: cands.map((c) => c.id), msg: `${cands.length} ${kind}s match. Which one? (never guessed)` };
    return { ok: true, cmd: { op: kind === "door" ? "DELETE_DOOR" : "DELETE_WINDOW", [`${kind}_id`]: cands[0].id } };
  }

  const mv = t.match(/\bmove\b.*\b(wall|partition)\b.*?(\d+(?:\.\d+)?)\s*(px|pixels?|mm|cm|m)?\b.*\b(left|right)\b/);
  if (mv) {
    const unit = (mv[3] || "px").startsWith("p") ? "px" : mv[3];
    const val = parseFloat(mv[2]);
    const dir = mv[4] === "left" ? -1 : 1;
    const target = /between|kitchen|living|partition|that wall|this wall|the wall/.test(t) ? "w5" : null;
    if (!target) return fail("entities", "Which wall? Mention the rooms it separates.");
    if (unit !== "px")
      return fail("semantic", `Distance in ${unit}, but no scale is calibrated (mm_per_pixel = null). Refused rather than assuming pixels are millimetres.`);
    return { ok: true, cmd: { op: "MOVE_WALL", wall_id: target, delta: { value: val * dir, unit: "px" } } };
  }

  return fail("parse", "No rule matched. Text maps to one of 8 typed commands or is rejected — never improvised.");
}

function apply(model, cmd) {
  if (cmd.op === "DELETE_DOOR") return { ok: true, model: { ...model, doors: model.doors.filter((d) => d.id !== cmd.door_id) } };
  if (cmd.op === "DELETE_WINDOW") return { ok: true, model: { ...model, windows: model.windows.filter((d) => d.id !== cmd.window_id) } };
  if (cmd.op === "MOVE_WALL") {
    const p = model.p + cmd.delta.value;
    if (p - X0 < 70 || X1 - p < 70)
      return { ok: false, stage: "constraints", msg: `Room width would drop to ${Math.round(Math.min(p - X0, X1 - p))} px (< 70 px minimum). Polygon rejected, model unchanged.` };
    // openings on horizontal walls must stay off the partition
    const clash = [...model.doors, ...model.windows].find((o) => !isVertical(o.wall) && Math.abs(o.c - p) < 26);
    if (clash) return { ok: false, stage: "constraints", msg: `Wall would cut through ${clash.id}. Openings must stay on a single wall.` };
    return { ok: true, model: { ...model, p } };
  }
  return { ok: false, stage: "geometry", msg: "Unsupported operation." };
}

export default function FloorPlanLab() {
  const [cv, setCv] = useState(-1); // -1 = raw upload, 0..8 stages done
  const [versions, setVersions] = useState([{ v: 1, model: INITIAL, label: "processed", discarded: false }]);
  const [head, setHead] = useState(0);
  const [input, setInput] = useState("");
  const [run, setRun] = useState(null); // {stages: idx reached, fail}
  const [pending, setPending] = useState(null); // clarification
  const [log, setLog] = useState([]);
  const [json, setJson] = useState(null);
  const timers = useRef([]);

  const model = versions[head].model;
  const processed = cv >= CV_STAGES.length;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const process = () => {
    setCv(0);
    CV_STAGES.forEach((_, i) => timers.current.push(setTimeout(() => setCv(i + 1), 380 * (i + 1))));
  };

  const animateEdit = (reach, fail, done) => {
    setRun({ reach: 0, fail: null });
    for (let i = 0; i <= reach; i++) {
      timers.current.push(
        setTimeout(() => {
          setRun({ reach: i, fail: i === reach ? fail : null });
          if (i === reach) done?.();
        }, 140 * i)
      );
    }
  };

  const record = (instruction, status, stage, msg) =>
    setLog((l) => [{ instruction, status, stage, msg, t: Date.now() }, ...l].slice(0, 5));

  const commit = (instruction, cmd) => {
    setJson(cmd);
    const res = apply(model, cmd);
    if (!res.ok) {
      const idx = EDIT_STAGES.indexOf(res.stage);
      animateEdit(idx, res.stage, () => record(instruction, "REJECTED", res.stage, res.msg));
      return;
    }
    const kept = versions.map((v, i) => (i > head ? { ...v, discarded: true } : v));
    const nv = { v: kept.length + 1, model: res.model, label: cmd.op, discarded: false };
    animateEdit(EDIT_STAGES.length - 1, null, () => {
      setVersions([...kept, nv]);
      setHead(kept.length);
      record(instruction, "APPLIED", "commit", `${cmd.op} → v${nv.v} (HEAD)`);
    });
  };

  const submit = (text) => {
    if (!processed) return;
    const instruction = text ?? input;
    setPending(null);
    const r = interpret(instruction, model);
    if (r.ok) return commit(instruction, r.cmd);
    setJson(null);
    const idx = EDIT_STAGES.indexOf(r.stage);
    animateEdit(idx, r.stage, () => {
      if (r.clarify) {
        setPending({ ...r, instruction });
        record(instruction, "CLARIFICATION", r.stage, r.msg);
      } else record(instruction, "REJECTED", r.stage, r.msg);
    });
  };

  const resolveClarify = (id) => {
    const cmd = pending.kind === "door" ? { op: "DELETE_DOOR", door_id: id } : { op: "DELETE_WINDOW", window_id: id };
    const ins = `${pending.instruction} → ${id}`;
    setPending(null);
    commit(ins, cmd);
  };

  const live = versions.map((v, i) => ({ ...v, i })).filter((v) => !v.discarded);
  const canUndo = live.some((v) => v.i < head);
  const canRedo = live.some((v) => v.i > head);
  const undo = () => {
    const prev = [...live].reverse().find((v) => v.i < head);
    if (!prev) return;
    setHead(prev.i);
    record("undo", "UNDO", "commit", `HEAD → v${prev.v}`);
  };
  const redo = () => {
    const nxt = live.find((v) => v.i > head);
    if (!nxt) return;
    setHead(nxt.i);
    record("redo", "REDO", "commit", `HEAD → v${nxt.v}`);
  };

  const p = model.p;
  const showWalls = cv >= 2 || processed;
  const showObjects = cv >= 4;
  const showRooms = cv >= 5;
  const showLabels = cv >= 7;
  const cands = pending?.ids || [];

  return (
    <DemoFrame
      title="Floor plan → typed model → language edits"
      hint={processed ? "Type an edit or try a preset. Try to break it." : "Step 1 — run the CV pipeline on the uploaded plan."}
      note={
        <>
          Stage names, the edit pipeline order, clarification-instead-of-guessing, the null-scale refusal, constraint
          rejections and HEAD-pointer versioning follow the real backend. The plan is a synthetic two-room drawing (the
          project itself has only been exercised on synthetic plans) and the grammar here is a compact port of its
          offline rules parser.
        </>
      }
    >
      <div className="fp">
        <div className="fp-canvas">
          <svg viewBox="0 0 600 380" className={`fp-svg ${cv < 1 ? "raw" : ""}`}>
            <defs>
              <pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="rgba(13,13,13,.06)" />
              </pattern>
            </defs>
            <rect width="600" height="380" fill="url(#fp-grid)" />
            <g className="fp-plan" style={{ transform: cv < 1 ? "rotate(-2.2deg)" : "none" }}>
              {showRooms && (
                <>
                  <motion.rect x={X0} y={Y0} height={Y1 - Y0} animate={{ width: p - X0 }} initial={false} className="fp-room k" />
                  <motion.rect y={Y0} height={Y1 - Y0} animate={{ x: p, width: X1 - p }} initial={false} className="fp-room l" />
                </>
              )}
              {["w1", "w2", "w3", "w4"].map((w) => {
                const [a, b, c, d] = wallGeom(w, p);
                return <line key={w} x1={a} y1={b} x2={c} y2={d} className={`fp-wall ${showWalls ? "on" : ""}`} />;
              })}
              <motion.line y1={Y0} y2={Y1} animate={{ x1: p, x2: p }} initial={false} className={`fp-wall ${showWalls ? "on" : ""}`} />

              {showObjects &&
                model.windows.map((o) => {
                  const [x, y] = openingXY(o, p);
                  const v = isVertical(o.wall);
                  return (
                    <motion.g key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1, x: 0 }} className={`fp-win ${cands.includes(o.id) ? "cand" : ""}`}>
                      <rect x={v ? x - 5 : x - 24} y={v ? y - 24 : y - 5} width={v ? 10 : 48} height={v ? 48 : 10} />
                      <line x1={v ? x : x - 24} y1={v ? y - 24 : y} x2={v ? x : x + 24} y2={v ? y + 24 : y} />
                      {(cands.includes(o.id) || showLabels) && (
                        <text x={v ? x + (o.wall === "w2" ? -30 : 12) : x} y={v ? y : y + (o.wall === "w1" ? 22 : -14)} className="fp-tag">
                          {o.id}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              {showObjects &&
                model.doors.map((o) => {
                  const [x, y] = openingXY(o, p);
                  const v = isVertical(o.wall);
                  const r = 30;
                  const arc = v
                    ? `M${x} ${y - 15} l ${o.wall === "w4" ? r : -r} 0 A ${r} ${r} 0 0 ${o.wall === "w4" ? 1 : 0} ${x} ${y + 15}`
                    : `M${x - 15} ${y} l 0 ${o.wall === "w1" ? r : -r} A ${r} ${r} 0 0 ${o.wall === "w1" ? 0 : 1} ${x + 15} ${y}`;
                  return (
                    <motion.g
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`fp-door ${cands.includes(o.id) ? "cand" : ""}`}
                      onClick={() => cands.includes(o.id) && resolveClarify(o.id)}
                    >
                      <rect x={v ? x - 6 : x - 16} y={v ? y - 16 : y - 6} width={v ? 12 : 32} height={v ? 32 : 12} className="fp-gap" />
                      <path d={arc} />
                      {cands.includes(o.id) && <circle cx={x} cy={y} r="26" className="fp-ring" />}
                      {(cands.includes(o.id) || showLabels) && (
                        <text x={v ? x + (o.wall === "w4" ? 36 : 8) : x + 18} y={v ? y - 20 : y + (o.wall === "w1" ? 46 : -36)} className="fp-tag">
                          {o.id}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              {showLabels && (
                <>
                  <motion.text animate={{ x: (X0 + p) / 2 }} initial={false} y={196} className="fp-label">
                    KITCHEN
                  </motion.text>
                  <motion.text animate={{ x: (X0 + p) / 2 }} initial={false} y={214} className="fp-area">
                    {((p - X0) * (Y1 - Y0)).toLocaleString()} px²
                  </motion.text>
                  <motion.text animate={{ x: (p + X1) / 2 }} initial={false} y={196} className="fp-label">
                    LIVING ROOM
                  </motion.text>
                  <motion.text animate={{ x: (p + X1) / 2 }} initial={false} y={214} className="fp-area">
                    {((X1 - p) * (Y1 - Y0)).toLocaleString()} px²
                  </motion.text>
                </>
              )}
            </g>
            {cv === 0 && <rect className="fp-scan" x="0" y="0" width="600" height="6" />}
          </svg>
          {!processed && (
            <div className="fp-overlay">
              {cv < 0 ? (
                <button className="btn btn-clay" onClick={process} data-cursor="run pipeline">
                  Run 8-stage CV pipeline ▸
                </button>
              ) : (
                <span className="mono">processing… {cv}/8</span>
              )}
            </div>
          )}
        </div>

        <ol className="fp-cv">
          {CV_STAGES.map(([n, d, crit], i) => (
            <li key={n} className={cv > i ? "done" : cv === i ? "on" : ""}>
              <span className="mono">
                {i + 1}. {n}
                {crit && <em>critical</em>}
              </span>
              <small>{d}</small>
            </li>
          ))}
        </ol>

        {processed && (
          <div className="fp-cmd">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="fp-input neu"
            >
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='e.g. "delete the window in the living room"' aria-label="Edit instruction" />
              <button className="btn btn-clay btn-sm" type="submit">
                Run
              </button>
            </form>
            <div className="fp-presets">
              {PRESETS.map((s) => (
                <button key={s} className="chip" onClick={() => (setInput(s), submit(s))} data-cursor="try it">
                  {s}
                </button>
              ))}
            </div>

            <div className="fp-pipe">
              {EDIT_STAGES.map((s, i) => {
                const reached = run && i <= run.reach;
                const failed = run?.fail === s;
                return (
                  <span key={s} className={`fp-step ${reached ? "ok" : ""} ${failed ? (pending ? "ask" : "bad") : ""}`}>
                    {s}
                  </span>
                );
              })}
            </div>

            {pending && (
              <div className="fp-clarify">
                <span className="mono red">CLARIFICATION</span> {pending.msg}
                <div>
                  {pending.ids.map((id) => (
                    <button key={id} className="btn btn-neu btn-sm" onClick={() => resolveClarify(id)}>
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="fp-bottom">
              <div className="fp-log">
                {log.length === 0 && <p className="mono dim">audit log is empty</p>}
                {log.map((l) => (
                  <div key={l.t} className={`fp-entry ${l.status.toLowerCase()}`}>
                    <span className="mono">{l.status}</span>
                    <p>
                      <b>“{l.instruction}”</b> — {l.msg}
                    </p>
                  </div>
                ))}
              </div>
              <div className="fp-side">
                <div className="fp-versions">
                  {versions.map((v, i) => (
                    <span key={v.v} className={`fp-v ${i === head ? "head" : ""} ${v.discarded ? "gone" : ""}`} title={v.label}>
                      v{v.v}
                    </span>
                  ))}
                </div>
                <div className="fp-undo">
                  <button className="btn btn-neu btn-sm" disabled={!canUndo} onClick={undo}>
                    ↶ Undo
                  </button>
                  <button className="btn btn-neu btn-sm" disabled={!canRedo} onClick={redo}>
                    Redo ↷
                  </button>
                </div>
                {json && <pre className="fp-json">{JSON.stringify(json, null, 1)}</pre>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoFrame>
  );
}
