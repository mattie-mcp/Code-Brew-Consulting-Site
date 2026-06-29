import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Summary.css";

export default function Summary() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section" id="summary">
      <div className="container summary">
        <p className="section__eyebrow">Profile</p>
        <h2 className="section__title">What I do</h2>

        <div className="reveal summary__body" ref={ref}>
          <span className="summary__rule" aria-hidden="true" />
          <p className="summary__lead">{profile.summary}</p>
        </div>
      </div>
    </section>
  );
}
