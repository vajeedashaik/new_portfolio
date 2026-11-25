import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects, skillGroups } from "../data/site.js";
import { scrollToId } from "../lib/motion.js";

const ALL = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.group })));

/** Hover a skill → wires light up to every system that uses it (and vice-versa). */
export default function SkillMap() {
  const root = useRef(null);
  const [active, setActive] = useState(null); // {type:'skill'|'proj', key}
  const [auto, setAuto] = useState(true);
  const [lines, setLines] = useState([]);

  // idle tour until the visitor interacts
  useEffect(() => {
    if (!auto) return;
    const withProjects = ALL.filter((s) => s.p.length > 1);
    let k = 0;
    setActive({ type: "skill", key: withProjects[0].n });
    const t = setInterval(() => {
      k = (k + 1) % withProjects.length;
      setActive({ type: "skill", key: withProjects[k].n });
    }, 2200);
    return () => clearInterval(t);
  }, [auto]);

  const pairs = useCallback(() => {
    if (!active) return [];
    if (active.type === "skill") {
      const s = ALL.find((x) => x.n === active.key);
      return s ? s.p.map((p) => [s.n, p]) : [];
    }
    return ALL.filter((s) => s.p.includes(active.key)).map((s) => [s.n, active.key]);
  }, [active]);

  const measure = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const out = pairs()
      .map(([s, p]) => {
        const a = el.querySelector(`[data-skill="${CSS.escape(s)}"]`);
        const b = el.querySelector(`[data-proj="${p}"]`);
        if (!a || !b) return null;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const x1 = ra.right - box.left, y1 = ra.top + ra.height / 2 - box.top;
        const x2 = rb.left - box.left, y2 = rb.top + rb.height / 2 - box.top;
        if (x2 <= x1) return { d: `M${ra.left + ra.width / 2 - box.left} ${ra.bottom - box.top} L ${rb.left + rb.width / 2 - box.left} ${rb.top - box.top}`, k: s + p };
        const mx = (x1 + x2) / 2;
        return { d: `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, k: s + p };
      })
      .filter(Boolean);
    setLines(out);
  }, [pairs]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const litSkills = new Set(pairs().map(([s]) => s));
  const litProjects = new Set(pairs().map(([, p]) => p));
  const enter = (type, key) => {
    setAuto(false);
    setActive({ type, key });
  };

  return (
    <section className="skills" id="stack">
      <div className="wrap">
        <div className="section-head">
          <span className="idx">(02)</span>
          <h2 data-split>
            <span className="ln">
              <span>The stack,</span>
            </span>
            <span className="ln">
              <span className="red">wired together.</span>
            </span>
          </h2>
          <p>Not a logo wall. Hover any skill to see which shipped system it powers — or hover a system to see what it took.</p>
        </div>

        <div className="sk" ref={root} onPointerLeave={() => setAuto(true)}>
          <svg className="sk-wires" aria-hidden="true">
            {lines.map((l) => (
              <path key={l.k} d={l.d} />
            ))}
          </svg>
          <div className="sk-groups">
            {skillGroups.map((g) => (
              <div key={g.group} className="sk-group" data-rv>
                <span className="mono red">{g.group}</span>
                <div>
                  {g.skills.map((s) => (
                    <button
                      key={s.n}
                      data-skill={s.n}
                      className={`sk-skill ${litSkills.has(s.n) ? "lit" : ""}`}
                      onPointerEnter={() => enter("skill", s.n)}
                      onFocus={() => enter("skill", s.n)}
                    >
                      {s.n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sk-projects">
            {projects.map((p) => (
              <button
                key={p.id}
                data-proj={p.id}
                className={`sk-proj ${litProjects.has(p.id) ? "lit clay" : "clay-white"}`}
                onPointerEnter={() => enter("proj", p.id)}
                onFocus={() => enter("proj", p.id)}
                onClick={() => scrollToId(p.id)}
                data-cursor="jump to demo"
              >
                <span className="mono">{p.no}</span>
                <b>{p.name}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
