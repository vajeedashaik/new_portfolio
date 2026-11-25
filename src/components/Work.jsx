import { lazy, Suspense } from "react";
import { projects } from "../data/site.js";
import { useInView } from "../lib/motion.js";

const DEMOS = {
  debate: lazy(() => import("../demos/DebateArena.jsx")),
  floorplan: lazy(() => import("../demos/FloorPlanLab.jsx")),
  evac: lazy(() => import("../demos/EvacSim.jsx")),
  moderation: lazy(() => import("../demos/ModQueue.jsx")),
  traffic: lazy(() => import("../demos/TrafficLab.jsx")),
  stack: lazy(() => import("../demos/StackLab.jsx")),
};

function DemoSlot({ kind }) {
  const [ref, seen] = useInView({ rootMargin: "400px 0px 400px 0px" });
  const Demo = DEMOS[kind];
  return (
    <div className="demo-slot" ref={ref}>
      {seen ? (
        <Suspense fallback={<div className="demo-loading glass mono">booting demo…</div>}>
          <Demo />
        </Suspense>
      ) : (
        <div className="demo-loading glass mono">demo loads on approach…</div>
      )}
    </div>
  );
}

function Chapter({ p, flip }) {
  return (
    <article className={`chapter ${flip ? "flip" : ""}`} id={p.id}>
      <div className="ch-bgno display" aria-hidden="true">
        {p.no}
      </div>
      <div className="ch-text">
        <div className="ch-kicker" data-rv>
          <span className="mono red">({p.no})</span>
          <span className="mono">{p.kicker}</span>
        </div>
        <h3 className="ch-name display" data-split>
          <span className="ln">
            <span>{p.name}</span>
          </span>
        </h3>
        <p className="ch-line" data-rv>
          {p.line}
        </p>
        {p.award && (
          <div className="ch-award clay" data-rv>
            <span className="mono">★</span> {p.award}
          </div>
        )}
        <div className="ch-body" data-rv>
          {p.body.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
        <dl className="ch-facts" data-rv>
          {p.facts.map(([k, v]) => (
            <div key={k} className="ch-fact neu-card">
              <dt className="mono">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="ch-stack" data-rv>
          {p.stack.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="ch-status" data-rv>
          <span className="status">{p.status}</span>
        </div>
        <div className="ch-next" data-rv>
          <span className="mono red">Next iteration →</span> {p.next}
        </div>
        {p.links.length > 0 && (
          <div className="ch-links" data-rv>
            {p.links.map((l) => (
              <a key={l.href} className="btn btn-neu btn-sm" href={l.href} target="_blank" rel="noreferrer" data-cursor="open">
                {l.label} <span className="arr">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="ch-demo">
        <DemoSlot kind={p.demo} />
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="section-head">
          <span className="idx">(01)</span>
          <h2 data-split>
            <span className="ln">
              <span>Systems you</span>
            </span>
            <span className="ln">
              <span className="red">can play with.</span>
            </span>
          </h2>
          <p>
            Six AI systems I designed and built end to end. Each one has a working demo beside it — drive the agents,
            break the validators, trigger the crisis.
          </p>
        </div>
        {projects.map((p, i) => (
          <Chapter key={p.id} p={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
