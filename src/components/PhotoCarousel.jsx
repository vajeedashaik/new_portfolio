import { useEffect, useRef, useState } from "react";

/**
 * Auto-advancing photo slideshow for the About section.
 * - Probes each src; only images that actually load join the rotation.
 * - Crossfades every `intervalMs` (default 5s). Pauses only while the tab is hidden.
 * - Falls back to a styled placeholder if nothing loads.
 */
export default function PhotoCarousel({ slides, intervalMs = 5000 }) {
  const [ready, setReady] = useState([]); // [{src, caption}]
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  // Probe images once.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      slides.map(
        (s) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(s);
            img.onerror = () => resolve(null);
            img.src = s.src;
          })
      )
    ).then((res) => {
      if (!cancelled) setReady(res.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [slides]);

  // Auto-advance.
  useEffect(() => {
    clearInterval(timer.current);
    if (paused || ready.length < 2) return;
    timer.current = setInterval(
      () => setIdx((i) => (i + 1) % ready.length),
      intervalMs
    );
    return () => clearInterval(timer.current);
  }, [ready, paused, intervalMs]);

  // Pause while tab hidden.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (ready.length === 0) {
    return (
      <div className="about-photo">
        <div className="ph">drop about.jpg in /public/photos/</div>
      </div>
    );
  }

  const active = idx % ready.length;

  return (
    <div className="about-photo carousel">
      {ready.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.caption || "Vajeeda Shaik"}
          className={i === active ? "on" : ""}
          aria-hidden={i === active ? "false" : "true"}
        />
      ))}

      {ready[active].caption && (
        <div className="carousel-cap">{ready[active].caption}</div>
      )}

      {ready.length > 1 && (
        <div className="carousel-dots">
          {ready.map((s, i) => (
            <button
              key={s.src}
              className={i === active ? "on" : ""}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
