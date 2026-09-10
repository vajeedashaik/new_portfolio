import { useEffect } from "react";

/**
 * Makes `.card` elements track the cursor: sets --mx / --my (percentages)
 * on whichever card the pointer is over, so the CSS red spotlight follows it.
 * One delegated listener for the whole page.
 */
export default function useCardSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    const onMove = (e) => {
      const card = e.target.closest?.(".card");
      if (!card) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}
