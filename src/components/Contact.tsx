import { profile, resumeForm } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import { formEnabled } from "../lib/resumeForm";
import ContactForm from "./ContactForm";
import "./Contact.css";

export default function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div ref={ref} className="reveal contact__inner">
          <p className="section__eyebrow">Get in touch</p>
          <h2 className="section__title">Let's build a team and ship the code</h2>

          <p className="chip contact__status">
            <span className="chip__dot" /> {profile.statusOpen}
          </p>

          {formEnabled ? (
            <>
              <p className="contact__intro">{resumeForm.intro}</p>
              <ContactForm />
            </>
          ) : (
            // Feature flag OFF: never a dead button — fall back to a plain mailto.
            <a
              className="btn btn--primary contact__cta"
              href={`mailto:${profile.email}`}
            >
              <span className="contact__cta-label">Email me</span>
              <span className="contact__cta-addr">{profile.email}</span>
            </a>
          )}

          <ul className="contact__links">
            <li>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="btn" href={profile.github} target="_blank" rel="noopener">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
