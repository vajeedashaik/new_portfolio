import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion.js";

/** Red dot cursor that swells over anything interactive and shows a label from [data-cursor]. */
export default function Cursor() {
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.18, ease: "power3" });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.18, ease: "power3" });
    const xl = gsap.quickTo(label.current, "x", { duration: 0.3, ease: "power3" });
    const yl = gsap.quickTo(label.current, "y", { duration: 0.3, ease: "power3" });

    const move = (e) => {
      xd(e.clientX);
      yd(e.clientY);
      xl(e.clientX);
      yl(e.clientY);
      const t = e.target.closest?.("a, button, [data-cursor], input, select, [role='button']");
      dot.current.classList.toggle("big", !!t);
      const text = t?.getAttribute?.("data-cursor") || "";
      label.current.textContent = text;
      label.current.classList.toggle("on", !!text);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div ref={dot} className="cursor" aria-hidden="true" />
      <div ref={label} className="cursor-label" aria-hidden="true" />
    </>
  );
}
