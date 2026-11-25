import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { profile, paper } from "../data/site.js";
import { gsap, prefersReduced, scrollToId } from "../lib/motion.js";
import HeroParticles from "./HeroParticles.jsx";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const Letters = ({ text }) =>
  text.split("").map((ch, i) => (
    <span className="ch" key={i}>
      <span>{ch}</span>
    </span>
  ));

export default function Hero() {
  const root = useRef(null);
  const [gl] = useState(hasWebGL);


  useEffect(() => {
    const el = root.current;
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hn .ch > span", { yPercent: 110, duration: 1.3, stagger: 0.035 }, 0.1)
          .from(".hero-photo", { y: 140, opacity: 0, duration: 1.6 }, 0.25)
          .from(".hero-claim .ln > span", { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.55)
          .from(".hero-sub, .hero-ctas, .hero-meta > *", { y: 24, opacity: 0, duration: 1, stagger: 0.06 }, 0.8)
          .from(".hchip", { scale: 0.6, opacity: 0, duration: 1, stagger: 0.12, ease: "back.out(1.8)" }, 1.0)
          .from(".hero-seal", { scale: 0, rotate: -120, duration: 1.4, ease: "back.out(1.4)" }, 1.2)
          .from(".hn-sig", { y: 30, opacity: 0, duration: 1.2 }, 0.5)
          .from(".hero-3d", { opacity: 0, scale: 0.85, duration: 1.6 }, 0.6);
      }

      // pointer parallax on layered depth
      if (!reduce && window.matchMedia("(pointer: fine)").matches) {
        const layers = gsap.utils.toArray("[data-depth]", el);
        const setters = layers.map((l) => ({
          d: parseFloat(l.dataset.depth),
          x: gsap.quickTo(l, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(l, "y", { duration: 0.9, ease: "power3" }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(nx * s.d * 40);
            s.y(ny * s.d * 26);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
    }, el);

    // scroll-out: name drifts, photo lifts
    const st = !reduce
      ? gsap.to(".hero-stage", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        })
      : null;

    return () => {
      ctx.revert();
      st?.scrollTrigger?.kill();
      st?.kill();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="gridlines" aria-hidden="true" />
      <HeroParticles />

      <div className="hero-stage">
        <div className="hero-meta wrap">
          <span className="mono">Portfolio · 2026</span>
          <span className="status ok">{profile.availability}</span>
          <span className="mono">{profile.location}</span>
        </div>

        {gl && (
          <div className="hero-3d" data-depth="-0.6" aria-hidden="true">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        )}

        <div className="hero-copy wrap">
          <h1 className="hero-claim" aria-label={profile.claim.join(" ")}>
            <span className="ln">
              <span>{profile.claim[0]}</span>
            </span>
            <span className="ln">
              <span className="serif red">{profile.claim[1]}</span>
            </span>
            <span className="ln">
              <span>{profile.claim[2]}</span>
            </span>
          </h1>
          <p className="hero-sub">{profile.sub}</p>
          <div className="hero-ctas">
            <a className="btn btn-clay" href="#work" onClick={(e) => (e.preventDefault(), scrollToId("work"))} data-cursor="scroll">
              Play with the systems <span className="arr">↓</span>
            </a>
            <a className="btn btn-neu" href={paper.url} target="_blank" rel="noreferrer" data-cursor="ieee xplore">
              Read my IEEE paper <span className="arr">↗</span>
            </a>
          </div>
        </div>

        {/* Layered name + cut-out: filled text behind, photo, outline text in front */}
        <div className="hero-name" aria-hidden="true">
          <div className="hn hn-last" data-depth="0.35">
            <Letters text={profile.last} />
          </div>
        </div>

        <div className="hero-photo" data-depth="0.7">
          <div className="hero-photo-inner">
            <img src={profile.cutout} alt={`Portrait of ${profile.name}`} width="808" height="806" fetchPriority="high" />
            <div className="hero-photo-shadow" />
            <div className="hero-seal" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="sealpath" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
                </defs>
                <text>
                  <textPath href="#sealpath">AI/ML ENGINEER ✺ RL ENVIRONMENTS ✺ LLM SYSTEMS ✺ VISION ✺</textPath>
                </text>
              </svg>
              <span className="seal-core clay">AI</span>
            </div>
          </div>
        </div>

        <div className="hero-name hero-name-front" aria-hidden="true">
          <div className="hn-sig serif" data-depth="0.5">
            {profile.first.charAt(0) + profile.first.slice(1).toLowerCase()}
          </div>
          <div className="hn hn-last outline" data-depth="0.35">
            <Letters text={profile.last} />
          </div>
        </div>

        {/* floating glass evidence chips */}
        <div className="hchip glass hchip-a" data-depth="1.2">
          <span className="mono red">IEEE · first author</span>
          <b>93.69%</b>
          <span>congestion accuracy</span>
        </div>
        <div className="hchip glass hchip-c" data-depth="1">
          <span className="mono red">Finalist</span>
          <b>70,000+</b>
          <span>Meta × HF × PyTorch</span>
        </div>

      </div>
    </section>
  );
}
