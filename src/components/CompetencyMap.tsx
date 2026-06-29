import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { competencyTree, type CompNode } from "../data/competencies";
import { useReveal } from "../hooks/useReveal";
import "./CompetencyMap.css";

const ROOT: CompNode = { code: "", label: "Competencies", children: competencyTree };
const ROOT_PTS: Array<[number, number]> = [
  [50, 16],
  [80, 50],
  [50, 84],
  [20, 50],
];

// The incoming half of a transition, run after the new level renders.
type Pending = { kind: "in-descend" | "in-ascend" | "evidence" } | null;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CompetencyMap() {
  const reveal = useReveal<HTMLDivElement>();
  const [path, setPath] = useState<string[]>([]);
  const [leaf, setLeaf] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const pending = useRef<Pending>(null);
  const animating = useRef(false);

  // ---- Resolve the current focus + its on-screen children ----
  let focus = ROOT;
  const pathNodes: CompNode[] = [];
  for (const code of path) {
    const next = (focus.children || []).find((c) => c.code === code);
    if (!next) break;
    focus = next;
    pathNodes.push(next);
  }
  const kids = focus.children || [];
  const isRoot = pathNodes.length === 0;

  const kidPos: Array<[number, number]> = kids.map((_, i) => {
    if (isRoot) return ROOT_PTS[i] || [50, 50];
    const n = kids.length;
    const x = n === 1 ? 50 : 26 + (48 * i) / (n - 1);
    return [x, 72];
  });

  const motionOK = () =>
    !prefersReducedMotion() && document.visibilityState === "visible";

  // ---- Phase 1: fly the CURRENT view into the tapped node (or pull back),
  // resolving once the camera has travelled. Phase 2 (the new level emerging)
  // runs in the layout effect below, after React swaps the content. ----
  function flyOut(kind: "descend" | "ascend", ox: number, oy: number): Promise<void> {
    const el = stageRef.current;
    if (!el || !motionOK()) return Promise.resolve();
    el.getAnimations().forEach((a) => a.cancel());
    el.style.transformOrigin = `${ox}% ${oy}%`;
    const frames =
      kind === "descend"
        ? [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(2.4)", opacity: 0 },
          ]
        : [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(0.7)", opacity: 0 },
          ];
    const anim = el.animate(frames, {
      duration: kind === "descend" ? 260 : 200,
      easing: "cubic-bezier(.4, 0, 1, 1)", // accelerate as the camera dives in
      fill: "forwards",
    });
    return anim.finished.then(() => undefined).catch(() => undefined);
  }

  // ---- Phase 2: the freshly-rendered level emerges from the same point. ----
  useLayoutEffect(() => {
    const p = pending.current;
    pending.current = null;
    if (!p) return;

    if (p.kind === "evidence") {
      const el = evidenceRef.current;
      if (el && motionOK()) {
        el.getAnimations().forEach((a) => a.cancel());
        el.animate(
          [{ transform: "translateY(8px)" }, { transform: "translateY(0)" }],
          { duration: 300, easing: "cubic-bezier(.22,.61,.36,1)" },
        );
      }
      return;
    }

    const el = stageRef.current;
    if (!el) {
      animating.current = false;
      return;
    }
    // Clear the forwards-filled fly-out before the new content can paint.
    el.getAnimations().forEach((a) => a.cancel());
    if (!motionOK()) {
      animating.current = false;
      return;
    }
    el.style.transformOrigin = p.kind === "in-descend" ? "50% 40%" : "50% 30%";
    const frames =
      p.kind === "in-descend"
        ? [
            { transform: "scale(0.62)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ]
        : [
            { transform: "scale(1.35)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ];
    const anim = el.animate(frames, {
      duration: 340,
      easing: "cubic-bezier(0, .55, .3, 1)", // settle in
    });
    const done = () => {
      animating.current = false;
    };
    anim.finished.then(done).catch(done);
  }, [path, leaf]);

  async function descend(code: string, ox: number, oy: number) {
    if (animating.current) return;
    animating.current = true;
    await flyOut("descend", ox, oy);
    pending.current = { kind: "in-descend" };
    setLeaf(null);
    setPath((p) => [...p, code]);
  }
  function toggleLeaf(code: string) {
    if (animating.current) return;
    setLeaf((cur) => {
      const nextLeaf = cur === code ? null : code;
      pending.current = nextLeaf ? { kind: "evidence" } : null;
      return nextLeaf;
    });
  }
  async function goTo(p: string[]) {
    if (animating.current) return;
    animating.current = true;
    await flyOut("ascend", 50, 30);
    pending.current = { kind: "in-ascend" };
    setLeaf(null);
    setPath(p);
  }
  async function back() {
    if (animating.current) return;
    if (leaf) {
      setLeaf(null);
      return;
    }
    animating.current = true;
    await flyOut("ascend", 50, 30);
    pending.current = { kind: "in-ascend" };
    setPath((p) => p.slice(0, -1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && (leaf || path.length > 0)) {
      e.preventDefault();
      back();
    }
  }

  // ---- Breadcrumb ----
  const crumbs = [{ label: "Competencies", path: [] as string[] }];
  const acc: string[] = [];
  pathNodes.forEach((n) => {
    acc.push(n.code);
    crumbs.push({ label: `${n.code} ${n.label}`, path: acc.slice() });
  });

  // ---- Evidence (selected leaf) ----
  const selected = leaf ? kids.find((k) => k.code === leaf) : undefined;
  const evidence = selected?.evidence ? { node: selected, ...selected.evidence } : null;
  const canGoBack = pathNodes.length > 0 || !!leaf;

  return (
    <section className="section cmap" id="skills">
      <div className="container reveal" ref={reveal}>
          <div className="section__head">
            <p className="section__eyebrow">— Cupping Notes —</p>
            <h2 className="section__title">Competency map</h2>
            <p className="section__sub">
              A schematic of what I do — four core competencies down to the work that
              backs each one. <span className="cmap__hint">+ tap a node to explore</span>
            </p>
          </div>

          {/* breadcrumb + back */}
          <div className="cmap__crumbs">
            <nav className="cmap__crumb-trail" aria-label="Competency map location">
              {crumbs.map((cr, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <span className="cmap__crumb-item" key={cr.label}>
                    {i > 0 && <span className="cmap__crumb-sep" aria-hidden="true">›</span>}
                    <button
                      type="button"
                      className={`cmap__crumb${last ? " is-current" : ""}`}
                      onClick={() => {
                        if (!last) goTo(cr.path);
                      }}
                      disabled={last}
                      aria-current={last ? "true" : undefined}
                    >
                      {cr.label}
                    </button>
                  </span>
                );
              })}
            </nav>
            {canGoBack && (
              <button type="button" className="cmap__back" onClick={back}>
                ◀ back
              </button>
            )}
          </div>

          {/* map */}
          <div className="cmap__map" onKeyDown={onKeyDown}>
            <div className="cmap__stage" ref={stageRef}>
              <svg
                className="cmap__svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {kids.map((k, i) => {
                  const [x, y] = kidPos[i];
                  const sel = leaf === k.code;
                  const d = isRoot
                    ? `M 50 50 L ${x} ${y}`
                    : `M 50 24 C 50 48 ${x} 48 ${x} ${y - 6}`;
                  return (
                    <path
                      key={k.code}
                      d={d}
                      fill="none"
                      stroke={sel ? "#c98a4e" : "#cbbfa8"}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>

              {isRoot ? (
                <div className="cmap__hub" aria-hidden="true" />
              ) : (
                <div className="cmap__focus">
                  <span className="cmap__focus-code">{focus.code}</span>
                  <span className="cmap__focus-label">{focus.label}</span>
                </div>
              )}

              {kids.map((k, i) => {
                const [x, y] = kidPos[i];
                const hasChildren = !!(k.children && k.children.length);
                const sel = leaf === k.code;
                const sub = isRoot
                  ? k.subtitle || ""
                  : hasChildren
                    ? "explore →"
                    : sel
                      ? "viewing ↓"
                      : "view evidence →";
                const style: CSSProperties = {
                  left: `${x}%`,
                  top: `${y}%`,
                  maxWidth: isRoot ? 190 : 210,
                };
                return (
                  <button
                    type="button"
                    key={k.code}
                    className={`cmap__node${isRoot ? " cmap__node--core" : ""}${sel ? " is-selected" : ""}`}
                    style={style}
                    aria-label={`${k.code} ${k.label}${hasChildren ? " — explore" : " — view evidence"}`}
                    onClick={() =>
                      hasChildren ? descend(k.code, x, y) : toggleLeaf(k.code)
                    }
                  >
                    <span className="cmap__node-code">{k.code}</span>
                    <span className="cmap__node-label">{k.label}</span>
                    <span className="cmap__node-sub">{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* evidence */}
          {evidence && (
            <div className="cmap__evidence" ref={evidenceRef} role="region" aria-label="Evidence">
              <span className="cmap__evidence-eyebrow">EVIDENCE · {evidence.node.code}</span>
              <h3 className="cmap__evidence-title">{evidence.node.label}</h3>
              <p className="cmap__evidence-desc">{evidence.desc}</p>
              <a className="cmap__evidence-link" href={evidence.link}>
                → {evidence.linkLabel}
              </a>
            </div>
          )}
      </div>
    </section>
  );
}
