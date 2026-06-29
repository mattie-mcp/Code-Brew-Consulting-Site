import { useState } from "react";
import { roles, resume } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Receipt.css";

export default function Receipt() {
  const ref = useReveal<HTMLDivElement>();
  const [openRole, setOpenRole] = useState(0);

  return (
    <section className="section receipt" id="career">
      <div ref={ref} className="reveal receipt__inner">
        <div className="section__head">
          <p className="section__eyebrow">— The Receipt —</p>
          <h2 className="section__title">Resume, itemized</h2>
          <p className="section__sub">Tap a line to see what was in the order.</p>
        </div>

        <div className="receipt__card">
          <div className="receipt__zigzag" aria-hidden="true" />
          <div className="receipt__masthead">
            <div className="receipt__co">CODE BREW CO.</div>
            <div className="receipt__order">— ORDER #2024 · THANK YOU —</div>
          </div>

          {roles.map((role, i) => {
            const isOpen = i === openRole;
            return (
              <div className="receipt__row" key={`${role.company}-${role.dates}`}>
                <button
                  type="button"
                  className="receipt__line"
                  aria-expanded={isOpen}
                  onClick={() => setOpenRole((cur) => (cur === i ? -1 : i))}
                >
                  <span className="receipt__sign" aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                  <span className="receipt__line-body">
                    <span className="receipt__line-top">
                      <span className="receipt__title">{role.title}</span>
                      <span className="receipt__dates">{role.dates}</span>
                    </span>
                    <span className="receipt__company">{role.company}</span>
                  </span>
                </button>

                {isOpen && (
                  <div className="receipt__detail">
                    <ul className="receipt__bullets">
                      {role.bullets.map((b) => (
                        <li key={b}>
                          <span className="receipt__mark" aria-hidden="true">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="receipt__stack">
                      {role.stack.map((s) => (
                        <li key={s} className="tag">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <div className="receipt__education">
            <span>EDUCATION</span>
            <span className="receipt__education-val">{resume.education}</span>
          </div>
          <div className="receipt__total">
            <span>TOTAL EXPERIENCE</span>
            <span>{resume.totalYears}</span>
          </div>
          <div className="receipt__footer">★ THANK YOU · COME AGAIN ★</div>
        </div>
      </div>
    </section>
  );
}
