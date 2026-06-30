import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import { formEnabled, mailtoFallback } from "../lib/resumeForm";
import ContactForm from "./ContactForm";
import "./Contact.css";

export default function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section section--dark contact" id="contact">
      <div className="contact__inner">
        <div ref={ref} className="reveal">
          <div className="section__head">
            <p className="section__eyebrow contact__eyebrow">Pull up a chair ☕</p>
            <h2 className="section__title">Let's talk shop</h2>
            <p className="section__sub">
              Hiring, a contract, or just want to compare brewing methods — the kettle's
              always on.
            </p>
          </div>

          {formEnabled ? (
            <ContactForm />
          ) : (
            <a className="btn btn--primary contact__mailto" href={mailtoFallback}>
              Email me — {profile.email}
            </a>
          )}

          <div className="contact__links">
            <a className="contact__link" href={`mailto:${profile.email}`}>
              ✉ {profile.email}
            </a>
            <a
              className="contact__link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
            >
              LinkedIn ↗
            </a>
            <a
              className="contact__link"
              href={profile.github}
              target="_blank"
              rel="noopener"
            >
              GitHub ↗
            </a>
            <a
              className="contact__link"
              href={profile.repo}
              target="_blank"
              rel="noopener"
            >
              Site source ↗
            </a>
          </div>

          <p className="contact__footer">
            © 2026 Code Brew Consulting LLC · {profile.location} · Brewed by {profile.name}
          </p>
        </div>
      </div>
    </section>
  );
}
