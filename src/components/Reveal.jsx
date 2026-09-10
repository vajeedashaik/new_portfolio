import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal wrapper.
 *
 * Content is never left invisible:
 *  - reduced-motion, or a page rendered while hidden (background tab, crawler,
 *    prerender, headless) -> render plain, no animation.
 *  - otherwise fade/slide in when scrolled into view, with a timeout fallback.
 */
export default function Reveal({ children, delay = 0, y = 24, className }) {
  const reduce = useReducedMotion();
  const startVisible =
    typeof document === "undefined" || document.hidden || reduce;

  const ref = useRef(null);
  const [shown, setShown] = useState(startVisible);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    const reveal = () => setShown(true);

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 1.1 && r.bottom > 0) {
      reveal();
      return;
    }

    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal();
            io.disconnect();
          }
        },
        { rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    }

    const t = setTimeout(reveal, 1600);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, [shown]);

  if (startVisible) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
