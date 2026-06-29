import { caseStudies, type CaseStudy } from "../data/profile";
import { caseStudyAnchor } from "../data/competencies";
import { useReveal } from "../hooks/useReveal";
import "./Work.css";

function WorkCard({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      id={caseStudyAnchor(study.tag)}
      className="reveal work__card"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <header className="work__head">
        <h3 className="work__title">{study.title}</h3>
        <span className="tag work__tag">{study.tag}</span>
      </header>

      <dl className="work__detail">
        <div className="work__block">
          <dt className="work__label">Context</dt>
          <dd className="work__text">{study.context}</dd>
        </div>
        <div className="work__block">
          <dt className="work__label">What I did</dt>
          <dd className="work__text">{study.did}</dd>
        </div>
        <div className="work__block work__block--outcome">
          <dt className="work__label work__label--outcome">Outcome</dt>
          <dd className="work__text work__text--outcome">{study.outcome}</dd>
        </div>
      </dl>

      <ul className="work__stack">
        {study.stack.map((item) => (
          <li key={item} className="tag">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="container">
        <p className="section__eyebrow">Selected work</p>
        <h2 className="section__title">Case studies</h2>

        <div className="work__grid">
          {caseStudies.map((study, index) => (
            <WorkCard key={study.title} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
