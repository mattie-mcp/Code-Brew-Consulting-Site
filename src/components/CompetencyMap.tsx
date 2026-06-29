import {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  type KeyboardEvent,
} from "react";
import { competencyMap, type Leaf } from "../data/competencies";
import { useReveal } from "../hooks/useReveal";
import "./CompetencyMap.css";

/* ----------------------------------------------------------------
   Radial graph layout (deterministic, precomputed once at module load).
   Root at center; cores N/E/S/W on R1; branches fan into each core's
   angular wedge on R2; leaves into a tighter sub-wedge on R3.
----------------------------------------------------------------- */
const CENTER = 500;
const R1 = 155;
const R2 = 330;
const R3 = 470;
const WEDGE = 40; // half-width of a core's branch wedge, degrees
const LEAF_WEDGE = 15;

const pad2 = (n: number) => String(n + 1).padStart(2, "0");
const letter = (n: number) => String.fromCharCode(97 + n);

interface Pt {
  x: number;
  y: number;
}
interface GNode {
  id: string;
  level: 1 | 2 | 3;
  x: number;
  y: number;
  parent: Pt;
  path: number[];
  label: string;
  coord: string;
  leaf?: Leaf;
}

const ROOT: Pt = { x: CENTER, y: CENTER };

function polar(r: number, deg: number): Pt {
  const rad = (deg * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}
function spread(idx: number, count: number, half: number): number {
  if (count <= 1) return 0;
  return -half + (idx / (count - 1)) * 2 * half;
}

const NODES: GNode[] = [];
competencyMap.forEach((core, i) => {
  const ca = -90 + i * 90;
  const cp = polar(R1, ca);
  NODES.push({
    id: `c${i}`,
    level: 1,
    ...cp,
    parent: ROOT,
    path: [i],
    label: core.label,
    coord: pad2(i),
  });
  core.branches.forEach((branch, j) => {
    const ba = ca + spread(j, core.branches.length, WEDGE);
    const bp = polar(R2, ba);
    NODES.push({
      id: `c${i}-b${j}`,
      level: 2,
      ...bp,
      parent: cp,
      path: [i, j],
      label: branch.label,
      coord: `${pad2(i)}.${j + 1}`,
    });
    branch.leaves.forEach((leaf, k) => {
      const la = ba + spread(k, branch.leaves.length, LEAF_WEDGE);
      const lp = polar(R3, la);
      NODES.push({
        id: `c${i}-b${j}-l${k}`,
        level: 3,
        ...lp,
        parent: bp,
        path: [i, j, k],
        label: leaf.label,
        coord: `${pad2(i)}.${j + 1}.${letter(k)}`,
        leaf,
      });
    });
  });
});

/** Shallow outward-bowing quadratic edge — a routed trace, not an org-chart elbow. */
function edgePath(a: Pt, b: Pt): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let dx = mx - CENTER;
  let dy = my - CENTER;
  const dl = Math.hypot(dx, dy) || 1;
  const seg = Math.hypot(b.x - a.x, b.y - a.y);
  const off = seg * 0.12;
  return `M ${a.x} ${a.y} Q ${mx + (dx / dl) * off} ${my + (dy / dl) * off} ${b.x} ${b.y}`;
}

interface NState {
  visible: boolean;
  dim: boolean;
  on: boolean;
}
function nodeState(n: GNode, path: number[]): NState {
  const L = path.length;
  if (n.level === 1) {
    const on = L >= 1 && path[0] === n.path[0];
    return { visible: true, on, dim: L >= 1 && !on };
  }
  if (n.level === 2) {
    const visible = L >= 1 && path[0] === n.path[0];
    const on = L >= 2 && visible && path[1] === n.path[1];
    return { visible, on, dim: visible && L >= 2 && !on };
  }
  const visible = L >= 2 && path[0] === n.path[0] && path[1] === n.path[1];
  const on = L >= 3 && visible && path[2] === n.path[2];
  return { visible, on, dim: visible && L >= 3 && !on };
}

/* Camera target framing the focused node + its (about-to-bloom) children. */
function targetView(path: number[], aspect: number) {
  const L = path.length;
  let pts: Pt[];
  if (L === 0) {
    pts = [ROOT, ...NODES.filter((n) => n.level === 1)];
  } else if (L === 1) {
    pts = NODES.filter(
      (n) => (n.level === 1 && n.path[0] === path[0]) || (n.level === 2 && n.path[0] === path[0])
    );
  } else {
    pts = NODES.filter(
      (n) =>
        (n.level === 2 && n.path[0] === path[0] && n.path[1] === path[1]) ||
        (n.level === 3 && n.path[0] === path[0] && n.path[1] === path[1])
    );
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs) - 95;
  const maxX = Math.max(...xs) + 95;
  const minY = Math.min(...ys) - 60;
  const maxY = Math.max(...ys) + 60;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const w = Math.max((maxX - minX) * 1.12, (maxY - minY) * aspect * 1.12, 380);
  return { cx, cy, w };
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setReduce(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return reduce;
}

export default function CompetencyMap() {
  const reveal = useReveal<HTMLDivElement>();
  const [path, setPath] = useState<number[]>([]);
  const reduce = usePrefersReducedMotion();

  // Graph (SVG) only on wider viewports + motion allowed; else the rack fallback.
  const [graphMode, setGraphMode] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const u = () => setGraphMode(mq.matches && !reduce);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, [reduce]);

  const level = path.length;
  const core = level >= 1 ? competencyMap[path[0]] : null;
  const branch = level >= 2 && core ? core.branches[path[1]] : null;
  const selectedLeaf = level >= 3 && branch ? branch.leaves[path[2]] : null;

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && path.length > 0) {
        e.preventDefault();
        setPath((p) => p.slice(0, -1));
      }
    },
    [path.length]
  );

  // ---- Camera (animated viewBox) ----
  const canvasRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState({ w: 900, h: 520 });
  const aspect = panel.w / panel.h || 1.7;
  const viewRef = useRef({ cx: CENTER, cy: CENTER, w: 760 });
  const [, bump] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setPanel({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [graphMode]);

  useEffect(() => {
    if (!graphMode) return;
    const target = targetView(path, aspect);
    if (reduce) {
      viewRef.current = target;
      bump();
      return;
    }
    let raf = 0;
    const step = () => {
      const v = viewRef.current;
      const cx = v.cx + (target.cx - v.cx) * 0.16;
      const cy = v.cy + (target.cy - v.cy) * 0.16;
      const w = v.w + (target.w - v.w) * 0.16;
      viewRef.current = { cx, cy, w };
      bump();
      if (Math.abs(target.cx - cx) + Math.abs(target.cy - cy) + Math.abs(target.w - w) > 0.8) {
        raf = requestAnimationFrame(step);
      } else {
        viewRef.current = target;
        bump();
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [path, aspect, graphMode, reduce]);

  const v = viewRef.current;
  const vh = v.w / aspect;
  const viewBox = `${v.cx - v.w / 2} ${v.cy - vh / 2} ${v.w} ${vh}`;

  // Evidence card position — project the selected leaf to panel pixels.
  let cardPos: { left: number; top: number } | null = null;
  if (selectedLeaf && graphMode) {
    const leafNode = NODES.find((n) => n.level === 3 && n.path.join() === path.join());
    if (leafNode) {
      const sx = ((leafNode.x - (v.cx - v.w / 2)) / v.w) * panel.w;
      const sy = ((leafNode.y - (v.cy - vh / 2)) / vh) * panel.h;
      const cw = 300;
      let left = sx + 22;
      if (left + cw > panel.w - 14) left = sx - cw - 22;
      left = Math.max(14, Math.min(left, panel.w - cw - 14));
      const top = Math.max(14, Math.min(sy - 40, panel.h - 210));
      cardPos = { left, top };
    }
  }

  return (
    <section className="section cmap" id="competencies">
      <div className="container reveal" ref={reveal}>
        <p className="section__eyebrow">Technical breadth</p>
        <h2 className="section__title">Competency map</h2>
        <p className="cmap__intro">
          A schematic of what I do, from four core competencies down to the work that backs
          each one. <span className="cmap__hint">＋ click a node to explore</span>
        </p>

        <div className="cmap__panel crop" onKeyDown={onKeyDown}>
          {/* Breadcrumb rail (shared by graph + fallback) */}
          <nav className="cmap__crumbs" aria-label="Competency map location">
            <button
              type="button"
              className={`cmap__crumb${level === 0 ? " is-current" : ""}`}
              onClick={() => setPath([])}
            >
              Competencies
            </button>
            {core && (
              <>
                <span className="cmap__crumb-sep" aria-hidden="true">▸</span>
                <button
                  type="button"
                  className={`cmap__crumb${level === 1 ? " is-current" : ""}`}
                  onClick={() => setPath(path.slice(0, 1))}
                >
                  <span className="cmap__crumb-code">{pad2(path[0])}</span>
                  {core.label}
                </button>
              </>
            )}
            {branch && (
              <>
                <span className="cmap__crumb-sep" aria-hidden="true">▸</span>
                <button
                  type="button"
                  className={`cmap__crumb${level >= 2 ? " is-current" : ""}`}
                  onClick={() => setPath(path.slice(0, 2))}
                >
                  <span className="cmap__crumb-code">{`${pad2(path[0])}.${path[1] + 1}`}</span>
                  {branch.label}
                </button>
              </>
            )}
            {level > 0 && (
              <button
                type="button"
                className="cmap__back"
                onClick={() => setPath((p) => p.slice(0, -1))}
              >
                ◀ back
              </button>
            )}
          </nav>

          {/* ---- GRAPH (desktop, motion) ---- */}
          {graphMode ? (
            <div className="cmap__canvas" ref={canvasRef}>
              <svg
                className="cmap__svg"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                role="group"
                aria-label="Competency graph"
              >
                {/* edges */}
                <g aria-hidden="true">
                  {NODES.map((n) => {
                    const st = nodeState(n, path);
                    return (
                      <path
                        key={`e-${n.id}`}
                        className={`gedge${st.on ? " is-on" : ""}${st.dim ? " is-dim" : ""}${
                          st.visible ? "" : " is-hidden"
                        }`}
                        d={edgePath(n.parent, n)}
                        pathLength={1}
                      />
                    );
                  })}
                </g>

                {/* root */}
                <text className="gnode-root" x={CENTER} y={CENTER + 8} textAnchor="middle">
                  ◑
                </text>

                {/* nodes */}
                {NODES.map((n) => {
                  const st = nodeState(n, path);
                  const cls = `gnode gnode--l${n.level}${st.on ? " is-on" : ""}${
                    st.dim ? " is-dim" : ""
                  }${st.visible ? "" : " is-hidden"}`;
                  const w = n.level === 1 ? 128 : 108;
                  const h = n.level === 1 ? 36 : 28;
                  if (n.level === 3) {
                    const right = n.x >= CENTER;
                    return (
                      <g
                        key={n.id}
                        className={cls}
                        role="button"
                        tabIndex={st.visible ? 0 : -1}
                        aria-label={`${n.label}. ${n.leaf?.evidence ?? ""}`}
                        onClick={() => setPath(n.path)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setPath(n.path);
                          }
                        }}
                      >
                        <rect className="gleaf" x={n.x - 6} y={n.y - 6} width={12} height={12} />
                        <text
                          className="gnode-coord"
                          x={right ? n.x + 14 : n.x - 14}
                          y={n.y - 9}
                          textAnchor={right ? "start" : "end"}
                        >
                          {n.coord}
                        </text>
                        <text
                          className="gleaf-label"
                          x={right ? n.x + 14 : n.x - 14}
                          y={n.y + 5}
                          textAnchor={right ? "start" : "end"}
                        >
                          {n.label}
                        </text>
                      </g>
                    );
                  }
                  return (
                    <g
                      key={n.id}
                      className={cls}
                      role="button"
                      tabIndex={st.visible ? 0 : -1}
                      aria-label={n.label}
                      onClick={() => setPath(n.path)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPath(n.path);
                        }
                      }}
                    >
                      <rect
                        className="gplate"
                        x={n.x - w / 2}
                        y={n.y - h / 2}
                        width={w}
                        height={h}
                        rx={n.level === 1 ? 4 : 2}
                      />
                      <text className="gnode-coord" x={n.x - w / 2} y={n.y - h / 2 - 5}>
                        {n.coord}
                      </text>
                      <text
                        className={`gplate-label gplate-label--l${n.level}`}
                        x={n.x}
                        y={n.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* evidence card, anchored near the selected leaf */}
              {selectedLeaf && cardPos && (
                <aside
                  className="cmap__evidence cmap__evidence--float"
                  style={{ left: cardPos.left, top: cardPos.top }}
                  aria-label="Evidence"
                >
                  <span className="cmap__evidence-eyebrow">Evidence · {selectedLeaf && `${pad2(path[0])}.${path[1] + 1}.${letter(path[2])}`}</span>
                  <h3 className="cmap__evidence-title">{selectedLeaf.label}</h3>
                  <p className="cmap__evidence-claim">{selectedLeaf.claim}</p>
                  {selectedLeaf.stack && (
                    <ul className="cmap__evidence-stack">
                      {selectedLeaf.stack.map((s) => (
                        <li key={s} className="tag">{s}</li>
                      ))}
                    </ul>
                  )}
                  <a className="cmap__evidence-link" href={selectedLeaf.href}>
                    → See the work ({selectedLeaf.evidence})
                  </a>
                </aside>
              )}
            </div>
          ) : (
            /* ---- FALLBACK: rack drill-down (mobile + reduced-motion) ---- */
            <div className="cmap__body" key={path.join("-") || "root"}>
              {level === 0 && (
                <ul className="cmap__cores" aria-label="Core competencies">
                  {competencyMap.map((c, i) => (
                    <li key={c.label}>
                      <button type="button" className="cmap__core" onClick={() => setPath([i])}>
                        <span className="cmap__code">{pad2(i)}</span>
                        <span className="cmap__core-label">{c.label}</span>
                        <span className="cmap__core-desc">{c.descriptor}</span>
                        <span className="cmap__core-count">{c.branches.length} areas ↘</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {level >= 1 && core && (
                <div className={`cmap__stage${selectedLeaf ? " cmap__stage--evidence" : ""}`}>
                  <div className="cmap__focus">
                    <span className="cmap__code">
                      {branch ? `${pad2(path[0])}.${path[1] + 1}` : pad2(path[0])}
                    </span>
                    <span className="cmap__focus-label">{branch ? branch.label : core.label}</span>
                    {!branch && <span className="cmap__focus-desc">{core.descriptor}</span>}
                    {branch && <span className="cmap__focus-parent">{core.label}</span>}
                  </div>
                  <ul className="cmap__children">
                    {!branch &&
                      core.branches.map((b, j) => (
                        <li key={b.label}>
                          <button type="button" className="cmap__child" onClick={() => setPath([path[0], j])}>
                            <span className="cmap__code">{`${pad2(path[0])}.${j + 1}`}</span>
                            <span className="cmap__child-label">{b.label}</span>
                            <span className="cmap__child-count">{b.leaves.length}</span>
                          </button>
                        </li>
                      ))}
                    {branch &&
                      branch.leaves.map((leaf, k) => (
                        <li key={leaf.label}>
                          <button
                            type="button"
                            className="cmap__child cmap__leaf"
                            aria-current={level >= 3 && path[2] === k ? "true" : undefined}
                            onClick={() => setPath([path[0], path[1], k])}
                          >
                            <span className="cmap__code">{`${pad2(path[0])}.${path[1] + 1}.${letter(k)}`}</span>
                            <span className="cmap__child-label">{leaf.label}</span>
                            <span className="cmap__leaf-src">{leaf.evidence}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                  {selectedLeaf && (
                    <aside className="cmap__evidence" aria-label="Evidence">
                      <span className="cmap__evidence-eyebrow">
                        Evidence · {`${pad2(path[0])}.${path[1] + 1}.${letter(path[2])}`}
                      </span>
                      <h3 className="cmap__evidence-title">{selectedLeaf.label}</h3>
                      <p className="cmap__evidence-claim">{selectedLeaf.claim}</p>
                      {selectedLeaf.stack && (
                        <ul className="cmap__evidence-stack">
                          {selectedLeaf.stack.map((s) => (
                            <li key={s} className="tag">{s}</li>
                          ))}
                        </ul>
                      )}
                      <a className="cmap__evidence-link" href={selectedLeaf.href}>
                        → See the work ({selectedLeaf.evidence})
                      </a>
                    </aside>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
