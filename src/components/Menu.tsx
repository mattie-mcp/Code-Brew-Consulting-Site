import { services } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import "./Menu.css";

export default function Menu() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section section--tint menu" id="menu">
      <div ref={ref} className="reveal menu__inner">
        <div className="section__head">
          <p className="section__eyebrow">— The Menu —</p>
          <h2 className="section__title">What Code Brew can pour for you</h2>
          <p className="section__sub">
            Independent software consulting — solo, senior, and hands-on.
          </p>
        </div>

        <div className="menu__card">
          {services.map((svc) => (
            <div className="menu__row" key={svc.name}>
              <div className="menu__line">
                <h3 className="menu__name">{svc.name}</h3>
                <span className="menu__leader" aria-hidden="true" />
                <span className="menu__tag">{svc.tag}</span>
              </div>
              <p className="menu__desc">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
