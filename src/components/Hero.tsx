import { hero } from "../data/profile";
import headshot from "../assets/headshot.jpg";
import "./Hero.css";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__grid-overlay" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__lead">
          <p className="hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="hero__name">
            {hero.nameLine}
            <br />
            <span className="hero__title-line">{hero.titleLine}</span>
          </h1>
          <p className="hero__blurb">
            <strong>{hero.firm}</strong>
            {hero.blurb}
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="btn btn--ghost" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="hero__portrait">
          <div className="hero__portrait-frame">
            <span className="hero__glow" aria-hidden="true" />
            <span className="hero__ring" aria-hidden="true" />
            <img className="hero__photo" src={headshot} alt="Mattie Phillips" />
          </div>
        </div>
      </div>
    </header>
  );
}
