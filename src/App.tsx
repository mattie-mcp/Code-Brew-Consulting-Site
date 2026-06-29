import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Summary from "./components/Summary";
import Work from "./components/Work";
import Experience from "./components/Experience";
import CompetencyMap from "./components/CompetencyMap";
import Skills from "./components/Skills";
import Consulting from "./components/Consulting";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Summary />
        <Work />
        <Experience />
        <CompetencyMap />
        <Skills />
        <Consulting />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
