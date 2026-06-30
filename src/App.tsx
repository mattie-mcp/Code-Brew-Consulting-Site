import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import CompetencyMap from "./components/CompetencyMap";
import Work from "./components/Work";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Menu />
        <CompetencyMap />
        <Work />
        <Contact />
      </main>
    </>
  );
}
