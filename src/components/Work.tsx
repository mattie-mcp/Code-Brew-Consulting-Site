import { projects, type Project } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Work.css";

function WorkCard({ project, index }: { project: Project; index: number }) {
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      className="reveal work__card"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="work__band">
        <span className="work__category">{project.category}</span>
      </div>
      <div className="work__body">
        <h3 className="work__title">{project.name}</h3>
        <p className="work__desc">{project.desc}</p>
        <ul className="work__stack">
          {project.stack.map((s) => (
            <li key={s} className="tag">{s}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section className="section section--tint work" id="work">
      <div className="container">
        <div className="section__head">
          <p className="section__eyebrow">— House Specials —</p>
          <h2 className="section__title">Selected work</h2>
        </div>

        <div className="work__grid">
          {projects.map((project, index) => (
            <WorkCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
