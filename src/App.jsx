import { useSmoothScroll, useReveals } from "./lib/motion.js";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Proof from "./components/Proof.jsx";
import Work from "./components/Work.jsx";
import MoreWork from "./components/MoreWork.jsx";
import SkillMap from "./components/SkillMap.jsx";
import Journey from "./components/Journey.jsx";
import Contact from "./components/Contact.jsx";

export default function App() {
  useSmoothScroll();
  useReveals();
  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Proof />
        <Work />
        <MoreWork />
        <SkillMap />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
