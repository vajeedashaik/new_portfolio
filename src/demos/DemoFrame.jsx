import { useState } from "react";

/** Glass shell shared by every demo: live badge, title, honesty note. */
export default function DemoFrame({ title, hint, note, children, className = "" }) {
  const [showNote, setShowNote] = useState(false);
  return (
    <div className={`demo glass ${className}`}>
      <div className="demo-head">
        <span className="demo-live mono">
          <i /> Live demo
        </span>
        <span className="demo-title">{title}</span>
        {note && (
          <button
            className="demo-info mono"
            onClick={() => setShowNote((v) => !v)}
            aria-expanded={showNote}
            data-cursor="how it's built"
          >
            {showNote ? "close" : "how faithful?"}
          </button>
        )}
      </div>
      {showNote && <div className="demo-note">{note}</div>}
      {hint && <div className="demo-hint mono">{hint}</div>}
      <div className="demo-body">{children}</div>
    </div>
  );
}
