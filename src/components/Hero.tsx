import { profile, resumeForm } from "../data/profile";
import { formEnabled, mailtoFallback } from "../lib/resumeForm";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__lead">
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>

          <p className="hero__valueprop">{profile.valueProp}</p>

          <p className="hero__recent">
            {profile.recentRole}
            <span className="hero__dot"> · </span>
            {profile.location} · {profile.remote}
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
            <a
              className="btn btn--strong"
              href={formEnabled ? "#contact" : mailtoFallback}
            >
              {resumeForm.ctaShort}
            </a>
            <span className="hero__actions-sep" aria-hidden="true" />
            <a className="btn btn--quiet" href={profile.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
            <a className="btn btn--quiet" href={profile.github} target="_blank" rel="noopener">
              GitHub
            </a>
          </div>
        </div>

        {/* Portrait-free monogram block — carries the warmth, needs no photo. */}
        <div className="hero__mark" aria-hidden="true">
          <span className="hero__mark-ring" />
          <span className="hero__mark-ring2" />
          <span className="hero__mark-mono">MP</span>
        </div>
      </div>
    </section>
  );
}
