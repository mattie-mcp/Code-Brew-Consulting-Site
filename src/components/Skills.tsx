import { skills, education } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Skills.css";

export default function Skills() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="section__eyebrow">Toolbox</p>
        <h2 className="section__title">Skills &amp; technologies</h2>

        <div className="skills__grid">
          {skills.map((group) => (
            <div className="skills__group" key={group.label}>
              <h3 className="skills__label">{group.label}</h3>
              <ul className="skills__items">
                {group.items.map((item) => (
                  <li className="tag skills__tag" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="skills__education">
          <h3 className="skills__edu-eyebrow">Education</h3>
          <div className="skills__edu-row">
            <p className="skills__edu-degree">{education.degree}</p>
            <p className="skills__edu-dates">{education.dates}</p>
          </div>
          <p className="skills__edu-school">{education.school}</p>
          <p className="skills__edu-detail">{education.detail}</p>
        </div>
      </div>
    </section>
  );
}
