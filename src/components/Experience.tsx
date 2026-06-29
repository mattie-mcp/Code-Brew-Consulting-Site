import { experience } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Experience.css";

export default function Experience() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section" id="experience">
      <div className="container reveal" ref={ref}>
        <p className="section__eyebrow">History</p>
        <h2 className="section__title">Experience</h2>

        <ol className="xp">
          {experience.map((item) => (
            <li className="xp__item" key={`${item.company}-${item.dates}`}>
              <span className="xp__marker" aria-hidden="true" />
              <div className="xp__body">
                <div className="xp__head">
                  <strong className="xp__role">{item.role}</strong>
                  <span className="xp__company">{item.company}</span>
                </div>
                <div className="xp__meta">
                  <time className="xp__dates">{item.dates}</time>
                  <span className="xp__location">{item.location}</span>
                </div>
                <p className="xp__note">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
