import useCardSpotlight from "../hooks/useCardSpotlight.js";
import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import Experience from "../components/Experience.jsx";
import Achievements from "../components/Achievements.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  useCardSpotlight();
  return (
    <div className="grain">
      <Nav />
      <Hero />
      <main>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
