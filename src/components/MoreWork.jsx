import { moreWork } from "../data/site.js";

export default function MoreWork() {
  return (
    <section className="more">
      <div className="wrap">
        <div className="more-head" data-rv>
          <span className="mono red">(01.b)</span>
          <h3 className="display">Also shipped</h3>
        </div>
        <div className="more-grid">
          {moreWork.map((m) => {
            const Tag = m.href ? "a" : "div";
            return (
              <Tag
                key={m.name}
                className="more-card glass"
                data-rv
                {...(m.href ? { href: m.href, target: "_blank", rel: "noreferrer", "data-cursor": "open" } : {})}
              >
                <div className="more-metric clay">
                  <b className="display">{m.metric}</b>
                  <span className="mono">{m.metricLabel}</span>
                </div>
                <h4>
                  {m.name} {m.href && <span className="arr">↗</span>}
                </h4>
                <p>{m.line}</p>
                <div className="more-tags">
                  {m.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
