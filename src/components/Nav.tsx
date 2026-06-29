import { useState } from "react";
import logoMug from "../assets/logo-mug.png";
import "./Nav.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#skills", label: "Competencies" },
  { href: "#work", label: "Work" },
  { href: "#career", label: "Resume" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          <img className="nav__logo" src={logoMug} alt="" width={38} height={38} />
          <span className="nav__lockup">
            <span className="nav__co">CODE&nbsp;BREW&nbsp;CO.</span>
            <span className="nav__tagline">Software Consulting</span>
          </span>
        </a>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="nav__cta" href="#contact" onClick={() => setOpen(false)}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
