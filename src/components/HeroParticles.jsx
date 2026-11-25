import { useCallback, useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { prefersReduced } from "../lib/motion.js";

// Stable init callback (the provider requires it).
const init = async (engine) => {
  await loadSlim(engine);
};

export default function HeroParticles() {
  const options = useMemo(() => {
    const small = typeof window !== "undefined" && window.innerWidth < 760;
    return {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: small ? 28 : 70, density: { enable: true } },
        color: { value: ["#e3262b", "#8e1318", "#0d0d0d"] },
        links: { enable: true, color: "#e3262b", opacity: 0.22, distance: 150, width: 1 },
        move: { enable: !prefersReduced(), speed: 0.55, outModes: { default: "bounce" } },
        opacity: { value: { min: 0.25, max: 0.7 } },
        size: { value: { min: 1.2, max: 3.2 } },
      },
      interactivity: {
        detectsOn: "window",
        events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
        modes: { grab: { distance: 190, links: { opacity: 0.65 } }, push: { quantity: 3 } },
      },
    };
  }, []);

  const loaded = useCallback(() => {}, []);

  return (
    <ParticlesProvider init={init}>
      <Particles id="hero-particles" className="hero-particles" options={options} particlesLoaded={loaded} />
    </ParticlesProvider>
  );
}
