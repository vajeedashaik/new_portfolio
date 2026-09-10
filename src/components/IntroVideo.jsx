import { useRef, useState } from "react";

/**
 * Animated intro avatar (ported from the previous portfolio's video.mp4).
 * Autoplays muted + looped (browser policy); clicking it — or the button —
 * unmutes and restarts from the top with sound.
 */
export default function IntroVideo({ src }) {
  const ref = useRef(null);
  const [sound, setSound] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !sound;
    v.muted = !next;
    if (next) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    setSound(next);
  };

  return (
    <div className="intro-video">
      <video
        ref={ref}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onClick={toggle}
      />
      <button
        className="intro-video-btn"
        onClick={toggle}
        aria-pressed={sound}
        aria-label={sound ? "Mute intro" : "Play intro with sound"}
      >
        {sound ? "🔈 Sound on" : "🔊 Play with sound"}
      </button>
    </div>
  );
}
