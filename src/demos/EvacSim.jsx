import { useCallback, useEffect, useRef, useState } from "react";
import DemoFrame from "./DemoFrame.jsx";

const ROWS = 3, COLS = 4, PEOPLE = 10, MAX_TICKS = 30;
const ZONES = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ZONES.push(`f0_r${r}_c${c}`);
const EXITS = [ZONES[0], ZONES[ZONES.length - 1]];
const rc = (z) => z.match(/r(\d)_c(\d)/).slice(1).map(Number);
const neighbours = (z) => {
  const [r, c] = rc(z);
  return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
    .filter(([a, b]) => a >= 0 && b >= 0 && a < ROWS && b < COLS)
    .map(([a, b]) => `f0_r${a}_c${b}`);
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bfs(from, to, blocked = new Set()) {
  const q = [[from]];
  const seen = new Set([from]);
  while (q.length) {
    const path = q.shift();
    const z = path[path.length - 1];
    if (z === to) return path;
    for (const n of neighbours(z)) {
      if (seen.has(n) || (blocked.has(n) && n !== to)) continue;
      seen.add(n);
      q.push([...path, n]);
    }
  }
  return null;
}

function makeEnv(seed) {
  const rnd = mulberry32(seed);
  const people = Array.from({ length: PEOPLE }, (_, i) => ({ id: i, z: ZONES[Math.floor(rnd() * ZONES.length)], out: false }));
  const nonExit = ZONES.filter((z) => !EXITS.includes(z));
  const h0 = nonExit[Math.floor(rnd() * nonExit.length)];
  return {
    seed, rnd, tick: 0, done: false, people,
    hazards: new Set([h0]),
    known: new Set([h0]),
    totals: { evac: 0, safety: 0, format: 0, timeout: 0 },
    last: null,
  };
}

// Observation is partial: each hazard is hidden from the policy with probability = noise.
function observe(env, noise) {
  env.known = new Set([...env.hazards].filter(() => env.rnd() >= noise));
}

function policy(env, kind) {
  const occ = {};
  env.people.filter((p) => !p.out).forEach((p) => (occ[p.z] = (occ[p.z] || 0) + 1));
  const zones = Object.keys(occ);
  if (!zones.length) return null;
  if (kind === "naive") {
    const z = zones.sort((a, b) => occ[b] - occ[a])[0];
    return { zone_id: z, route_to_exit: EXITS[0], path: bfs(z, EXITS[0]) };
  }
  // hazard-aware: urgency = occupancy x danger, route around *known* hazards to the nearest exit
  const danger = (z) => (env.known.has(z) ? 3 : neighbours(z).some((n) => env.known.has(n)) ? 2 : 1);
  const z = zones.sort((a, b) => occ[b] * danger(b) - occ[a] * danger(a))[0];
  let best = null;
  for (const ex of EXITS) {
    const p = bfs(z, ex, env.known) || bfs(z, ex);
    if (p && (!best || p.length < best.path.length)) best = { zone_id: z, route_to_exit: ex, path: p };
  }
  return best;
}

function step(env, kind, noise) {
  if (env.done) return env;
  observe(env, noise);
  const act = policy(env, kind);
  let newly = 0, safety = 0;
  if (act) {
    const next = act.path.length > 1 ? act.path[1] : act.path[0];
    env.people.forEach((p) => {
      if (p.out || p.z !== act.zone_id) return;
      if (EXITS.includes(p.z)) {
        p.out = true;
        newly++;
        return;
      }
      if (env.hazards.has(next)) safety -= 0.5;
      p.z = next;
      if (EXITS.includes(next)) {
        p.out = true;
        newly++;
      }
    });
  }
  // stochastic spread (p = 0.3 per hazard per tick)
  [...env.hazards].forEach((h) => {
    if (env.rnd() < 0.3) {
      const ns = neighbours(h);
      env.hazards.add(ns[Math.floor(env.rnd() * ns.length)]);
    }
  });
  env.tick += 1;
  const remaining = env.people.filter((p) => !p.out).length;
  env.done = remaining === 0 || env.tick >= MAX_TICKS;
  const evac = newly * (1 - env.tick / MAX_TICKS);
  const timeout = env.done ? -remaining : 0;
  env.totals = {
    evac: env.totals.evac + evac,
    safety: env.totals.safety + safety,
    format: env.totals.format + (act ? 0.1 : 0),
    timeout: env.totals.timeout + timeout,
  };
  env.last = act && { action_type: "route_zone", zone_id: act.zone_id, route_to_exit: act.route_to_exit, path: act.path };
  return env;
}

const sum = (t) => t.evac + t.safety + t.format + t.timeout;

export default function EvacSim() {
  const [seed, setSeed] = useState(7);
  const [kind, setKind] = useState("aware");
  const [noise, setNoise] = useState(0.15);
  const [playing, setPlaying] = useState(false);
  const [snap, setSnap] = useState(() => ({ ...makeEnv(7) }));
  const [board, setBoard] = useState([]);
  const env = useRef(makeEnv(7));
  const force = () => setSnap({ ...env.current, people: env.current.people.map((p) => ({ ...p })), hazards: new Set(env.current.hazards), known: new Set(env.current.known) });
  const logged = useRef(false);

  const reset = useCallback((s = seed) => {
    env.current = makeEnv(s);
    logged.current = false;
    setPlaying(false);
    force();
  }, [seed]);

  const tick = useCallback(() => {
    step(env.current, kind, noise);
    const e = env.current;
    if (e.done && !logged.current) {
      logged.current = true;
      setPlaying(false);
      setBoard((b) =>
        [{ seed: e.seed, kind, total: sum(e.totals), saved: e.people.filter((p) => p.out).length, ticks: e.tick }, ...b].slice(0, 4)
      );
    }
    force();
  }, [kind, noise]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(tick, 420);
    return () => clearInterval(t);
  }, [playing, tick]);

  const ignite = (z) => {
    const e = env.current;
    if (e.done || EXITS.includes(z)) return;
    e.hazards.add(z);
    force();
  };

  const e = snap;
  const occ = {};
  e.people.filter((p) => !p.out).forEach((p) => (occ[p.z] = (occ[p.z] || 0) + 1));
  const saved = e.people.filter((p) => p.out).length;
  const pathSet = new Set(e.last?.path || []);

  return (
    <DemoFrame
      title="CrisisCore · evacuation environment"
      hint="Click any room to trigger a new crisis. Compare policies on the same seed."
      note={
        <>
          A browser port of the environment's step rules: one action per tick, BFS routing, hazards spreading with p =
          0.3, partial observability via sensor noise, and the inline reward (evacuation speed, −0.5 per person stepped
          into a hazard, +0.1 format, −1 per person left at timeout). Both policies are hand-written baselines — the
          GRPO-trained policy has not been run yet.
        </>
      }
    >
      <div className="ev">
        <div className="ev-left">
          <div className="ev-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {ZONES.map((z) => {
              const hz = e.hazards.has(z);
              const kn = e.known.has(z);
              const ex = EXITS.includes(z);
              return (
                <button
                  key={z}
                  className={`ev-zone ${hz ? "hz" : ""} ${hz && !kn ? "unseen" : ""} ${ex ? "exit" : ""} ${e.last?.zone_id === z ? "routed" : ""} ${pathSet.has(z) ? "path" : ""}`}
                  onClick={() => ignite(z)}
                  data-cursor={ex ? "exit" : "ignite"}
                  aria-label={`${z}${hz ? " hazard" : ""}${ex ? " exit" : ""}`}
                >
                  <span className="ev-id mono">{z.replace("f0_", "")}</span>
                  {ex && <span className="ev-exit mono">EXIT</span>}
                  {hz && !kn && <span className="ev-unseen mono">unsensed</span>}
                  <span className="ev-people">
                    {Array.from({ length: occ[z] || 0 }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="ev-controls">
            <button className="btn btn-clay btn-sm" onClick={() => (e.done ? reset() : setPlaying((v) => !v))}>
              {e.done ? "New episode ↺" : playing ? "Pause ❚❚" : "Play ▸"}
            </button>
            <button className="btn btn-neu btn-sm" onClick={tick} disabled={e.done || playing}>
              Step
            </button>
            <button className="btn btn-neu btn-sm" onClick={() => reset(seed)}>
              Replay seed {seed}
            </button>
            <button
              className="btn btn-neu btn-sm"
              onClick={() => {
                const s = Math.floor(Math.random() * 9000) + 10;
                setSeed(s);
                reset(s);
              }}
            >
              New seed
            </button>
          </div>
        </div>

        <div className="ev-right">
          <div className="ev-toggle neu">
            {[
              ["naive", "Naive"],
              ["aware", "Hazard-aware"],
            ].map(([k, l]) => (
              <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
                {l}
              </button>
            ))}
          </div>
          <label className="ev-noise">
            <span className="mono">sensor noise {Math.round(noise * 100)}%</span>
            <input type="range" min="0" max="0.4" step="0.05" value={noise} onChange={(ev) => setNoise(+ev.target.value)} />
          </label>

          <div className="ev-stats">
            <div>
              <span className="mono">tick</span>
              <b>
                {e.tick}/{MAX_TICKS}
              </b>
            </div>
            <div>
              <span className="mono">evacuated</span>
              <b>
                {saved}/{PEOPLE}
              </b>
            </div>
            <div>
              <span className="mono">episode reward</span>
              <b className={sum(e.totals) < 0 ? "neg" : ""}>{sum(e.totals).toFixed(2)}</b>
            </div>
          </div>
          <div className="ev-break mono">
            <span>evacuation_speed {e.totals.evac.toFixed(2)}</span>
            <span>route_safety {e.totals.safety.toFixed(2)}</span>
            <span>format {e.totals.format.toFixed(1)}</span>
            <span>timeout {e.totals.timeout.toFixed(0)}</span>
          </div>
          <pre className="ev-json">{e.last ? JSON.stringify({ ...e.last, path: undefined }, null, 1) : "// press play — the agent acts once per tick"}</pre>
          {board.length > 0 && (
            <div className="ev-board">
              {board.map((b, i) => (
                <div key={i}>
                  <span className="mono">
                    seed {b.seed} · {b.kind}
                  </span>
                  <b className={b.total < 0 ? "neg" : ""}>{b.total.toFixed(2)}</b>
                  <span className="mono">
                    {b.saved}/{PEOPLE} out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
