import { profile, resumeForm } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import { formEnabled, mailtoFallback } from "../lib/resumeForm";
import "./Footer.css";

export default function Footer() {
  const ref = useReveal<HTMLDivElement>();
  const firstName = profile.name.split(" ")[0];

  return (
    <footer className="footer">
      <div className="container footer__inner reveal" ref={ref}>
        <div className="footer__top">
          <a className="footer__brand" href={profile.site} rel="noopener">
            <span className="footer__mark" aria-hidden="true">
              ◑
            </span>
            <span className="footer__name">{profile.name}</span>
          </a>

          <nav className="footer__links" aria-label="Footer">
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noopener">
              GitHub
            </a>
            <a href={formEnabled ? "#contact" : mailtoFallback}>
              {resumeForm.ctaShort}
            </a>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © 2026 {profile.name}. {profile.location}.
          </p>
          <p className="footer__built">
            Designed &amp; built by {firstName} — React, Vite, AWS S3 +
            CloudFront. Architected and implemented with an AI agent team.
          </p>
        </div>
      </div>
    </footer>
  );
}
