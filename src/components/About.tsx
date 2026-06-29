import { about } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./About.css";

export default function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="about" id="about">
      <div ref={ref} className="reveal about__inner">
        <p className="section__eyebrow">{about.eyebrow}</p>
        <h2 className="about__title">{about.title}</h2>
        <p className="about__bio">{about.bio}</p>
        <ul className="about__pills">
          {about.pills.map((p) => (
            <li key={p} className="chip">{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
