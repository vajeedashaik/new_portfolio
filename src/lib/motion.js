import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/** Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/** Batch scroll-reveals for every [data-rv] element. Content is never left hidden. */
export function useReveals(deps = []) {
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray("[data-rv]");
      gsap.set(els, { y: 46, opacity: 0 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });
      // Line-mask reveals for big headings
      gsap.utils.toArray("[data-split]").forEach((el) => {
        const lines = el.querySelectorAll(".ln > span");
        gsap.set(lines, { yPercent: 105 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }),
        });
      });
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** true once the element has entered the viewport (with margin). */
export function useInView(options = { rootMargin: "0px 0px -10% 0px" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);
  return [ref, seen];
}

/** Animated number that counts up when `run` turns true. */
export function useCountUp(target, run, { decimals = 0, duration = 1.6 } = {}) {
  const [v, setV] = useState(prefersReduced() ? target : 0);
  useEffect(() => {
    if (!run || prefersReduced()) {
      if (run) setV(target);
      return;
    }
    const o = { n: 0 };
    const t = gsap.to(o, {
      n: target,
      duration,
      ease: "expo.out",
      onUpdate: () => setV(o.n),
    });
    return () => t.kill();
  }, [run, target, duration]);
  return v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export { gsap, ScrollTrigger };
