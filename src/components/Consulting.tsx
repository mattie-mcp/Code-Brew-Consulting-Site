import { consulting, caseStudies } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Consulting.css";

export default function Consulting() {
  const ref = useReveal<HTMLDivElement>();

  // Link back to the independent case study shown above (plant-floor platform).
  const independentCase = caseStudies.find((c) =>
    c.tag.startsWith("Code Brew Consulting")
  );

  return (
    <section className="section" id="consulting">
      <div className="container">
        <p className="section__eyebrow">Independent work</p>
        <h2 className="section__title">Code Brew Consulting</h2>

        <div ref={ref} className="reveal consulting__card">
          <span className="consulting__mark" aria-hidden="true">
            ◑
          </span>
          <p className="consulting__blurb">{consulting.blurb}</p>

          {independentCase && (
            <p className="consulting__ref">
              See it in practice:{" "}
              <a href="#work">{independentCase.title}</a>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
