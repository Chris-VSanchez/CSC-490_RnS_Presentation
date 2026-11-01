import { useState, useEffect, useCallback, createContext, useContext } from "react";

/* ============ Colors for use in JSX (same values as index.css) ============ */
export const T = {
  ink: "#12161d", muted: "#5f6773", line: "#e2e5ea", card: "#ffffff", bg: "#f4f5f7",
  accent: "#0f766e", accentSoft: "#e3f3f1",
  blue: "#2563eb", blueSoft: "#e8efff",
  amber: "#b45309", amberSoft: "#fdf1e1",
  warn: "#c2410c", warnSoft: "#fdece4",
  good: "#15803d", goodSoft: "#e5f5ea",
};

/* ============ DeckShell: navigation, scaling, progress bar, notes ============ */
const W = 1280, H = 720;

// Any slide can call useDeck() to read the current slide or jump somewhere
const DeckContext = createContext({ index: 0, total: 0, go: () => {}, goTo: () => {} });
export const useDeck = () => useContext(DeckContext);

// ?export in the URL hides the on-screen controls (used by the PowerPoint export)
const EXPORTING = new URLSearchParams(window.location.search).has("export");

export function DeckShell({ slides }) {
  // Start on the slide in the URL (#3 = slide 3) so a page refresh keeps your place
  const [i, setI] = useState(() => {
    const n = parseInt(window.location.hash.slice(1), 10);
    return n >= 1 && n <= slides.length ? n - 1 : 0;
  });
  const [notes, setNotes] = useState(false);
  const [scale, setScale] = useState(1);

  const go = useCallback((n) => setI(Math.max(0, Math.min(slides.length - 1, n))), [slides.length]);

  // Keep the URL in sync with the current slide
  useEffect(() => { window.history.replaceState(null, "", `#${i + 1}`); }, [i]);

  // Scale the 1280x720 slide to fit any window
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return; // don't steal typing
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(i + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(i - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === "n" || e.key === "N") setNotes((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go, slides.length]);

  // goTo("express") jumps to the slide whose entry has id: "express"
  const goTo = useCallback((id) => { const k = slides.findIndex((x) => x.id === id); if (k >= 0) go(k); }, [slides, go]);

  const s = slides[i];
  return (
    <DeckContext.Provider value={{ index: i, total: slides.length, go, goTo }}>
    <div data-slide={i + 1} data-count={slides.length} data-notes={s.notes || ""}
      style={{ width: "100vw", height: "100vh", display: "grid", placeItems: "center", overflow: "hidden" }}>
      <div style={{ width: W * scale, height: H * scale }}>
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", background: T.bg, position: "relative", overflow: "hidden" }}>

          {/* progress bar: one clickable segment per slide */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", gap: 3, padding: "10px 14px 0", zIndex: 5 }}>
            {slides.map((_, k) => (
              <button key={k} aria-label={`Go to slide ${k + 1}`} onClick={() => go(k)}
                style={{ flex: 1, height: 5, border: 0, padding: 0, borderRadius: 3, cursor: "pointer", background: k <= i ? T.accent : "#d6dae0" }} />
            ))}
          </div>

          {/* the slide itself. key={i} resets its state each time you arrive */}
          <div key={i} style={{ height: "100%" }}>{s.el}</div>

          {/* bottom-right controls */}
          {!EXPORTING && <div style={{ position: "absolute", right: 16, bottom: 12, display: "flex", gap: 6, alignItems: "center", zIndex: 6 }}>
            <span className="note" style={{ fontSize: 12, marginRight: 4 }}>{i + 1} / {slides.length}</span>
            <button className="btn small" onClick={() => go(i - 1)} aria-label="Previous slide">←</button>
            <button className="btn small" onClick={() => go(i + 1)} aria-label="Next slide">→</button>
            <button className={"btn small" + (notes ? " on" : "")} onClick={() => setNotes(!notes)} title="Speaker notes (N)">N</button>
          </div>}

          {/* speaker notes strip */}
          {notes && s.notes && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(18,22,29,.94)", color: "#e5e9ef", padding: "14px 200px 14px 24px", fontSize: 15, lineHeight: 1.5, zIndex: 5 }}>
              <span style={{ color: "#5eead4", fontWeight: 700, marginRight: 8 }}>NOTES</span>{s.notes}
            </div>
          )}
        </div>
      </div>
    </div>
    </DeckContext.Provider>
  );
}

/* ============ Layout ============ */
export function Slide({ kicker, title, sub, children }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "44px 60px 40px" }}>
      {kicker && <div className="kicker">{kicker}</div>}
      {title && <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>{title}</h2>}
      {sub && <p className="lead" style={{ marginTop: 10, maxWidth: 980 }}>{sub}</p>}
      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

export function Split({ cols = "1fr 1fr", gap = 28, children }) {
  // minmax(0, 1fr) stops long code lines from pushing the column wider than the slide
  const safe = cols.replace(/(\d*\.?\d+)fr/g, "minmax(0, $1fr)");
  return <div style={{ display: "grid", gridTemplateColumns: safe, gap, flex: 1, minHeight: 0, alignItems: "start" }}>{children}</div>;
}

export function Col({ gap = 14, children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap, minHeight: 0 }}>{children}</div>;
}

/* ============ Code panel ============ */
const KEYWORDS = new Set(["import", "from", "export", "default", "const", "let", "var", "function", "return",
  "if", "else", "async", "await", "new", "try", "catch", "true", "false", "null", "undefined", "for", "of", "in"]);

// Turns one line of code into colored <span>s
function highlight(line) {
  const out = [];
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*|(?<![=\-])\/?>)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
  let last = 0;
  for (const m of line.matchAll(re)) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [text, comment, str, tag, num, word] = m;
    let cls = null;
    if (comment) cls = "tk-c";
    else if (str) cls = "tk-s";
    else if (tag) cls = "tk-p";
    else if (num) cls = "tk-n";
    else if (word && KEYWORDS.has(word)) cls = "tk-k";
    else if (word && line[m.index + text.length] === "(") cls = "tk-f";
    out.push(cls ? <span key={m.index} className={cls}>{text}</span> : text);
    last = m.index + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/**
 * <Code file="App.jsx" hl={[2]} err={[4]} dim onLine={setLine}>{`code here`}</Code>
 * hl: lines to highlight (1-based)  err: lines to mark red  dim: fade the other lines
 * onLine: makes lines clickable, called with the line number
 */
export function Code({ children, file, hl = [], err = [], dim = false, onLine, size }) {
  const lines = String(children).replace(/^\n/, "").replace(/\n$/, "").split("\n");
  return (
    <div className="code" style={{ fontSize: size }}>
      {file && <div className="file">{file}</div>}
      {lines.map((text, idx) => {
        const n = idx + 1;
        const on = hl.includes(n), bad = err.includes(n);
        const cls = ["ln", on && "hl", bad && "err", dim && hl.length && !on && !bad && "dim", onLine && "click"].filter(Boolean).join(" ");
        return (
          <div key={idx} className={cls} onClick={onLine ? () => onLine(n) : undefined}>
            <span className="n">{n}</span>
            <span>{highlight(text)}{text === "" ? " " : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============ Tabs: a row of pill buttons. value/onChange like an input ============ */
export function Tabs({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o} className={"btn small" + (o === value ? " on" : "")} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

/* ============ Reveal: hide something until clicked ============ */
export function Reveal({ label = "Reveal", children }) {
  const [open, setOpen] = useState(false);
  if (!open) return <div><button className="btn" onClick={() => setOpen(true)}>{label}</button></div>;
  return <div className="pop">{children}</div>;
}

/* ============ Term: a fake terminal that plays commands one at a time ============ */
export function Term({ script, height = 260, title, start = 0 }) {
  const [step, setStep] = useState(start);   // start = how many commands are already shown
  return (
    <div>
      <div className="term" style={{ height }}>
        <div className="dots"><i /><i /><i />{title && <span className="note" style={{ marginLeft: 8, fontSize: 12 }}>{title}</span>}</div>
        {script.slice(0, step).map((s, k) => (
          <div key={k} style={{ marginBottom: 6 }}>
            <div><span className="prompt">$ </span>{s.cmd}</div>
            {s.out && <div className={s.err ? "err" : ""} style={{ whiteSpace: "pre-wrap" }}>{s.out}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="btn small primary" disabled={step >= script.length} onClick={() => setStep(step + 1)}>
          {step >= script.length ? "Done" : `Run: ${script[step].cmd}`}
        </button>
        <button className="btn small" onClick={() => setStep(0)}>Reset</button>
      </div>
    </div>
  );
}

/* ============ Tiers: side-by-side cards with a colored top border ============ */
const TIER_COLORS = { Bronze: "#9a5b2b", Silver: "#5b6573", Gold: "#a16207", Bonus: T.accent };

export function Tiers({ tiers }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${tiers.length}, 1fr)`, gap: 12 }}>
      {tiers.map((t) => {
        const c = t.color || TIER_COLORS[t.name] || T.accent;
        return (
          <div key={t.name} className="panel" style={{ padding: 14, borderTop: `4px solid ${c}` }}>
            <div style={{ fontWeight: 800, color: c, marginBottom: 8 }}>{t.name}</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.5 }}>
              {t.items.map((it, k) => <li key={k} style={{ marginBottom: 4 }}>{it}</li>)}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ============ Checklist: click to tick off ============ */
export function Checklist({ items }) {
  const [done, setDone] = useState([]);
  const toggle = (k) => setDone(done.includes(k) ? done.filter((d) => d !== k) : [...done, k]);
  return (
    <Col gap={6}>
      {items.map((it, k) => {
        const on = done.includes(k);
        return (
          <button key={k} className="panel" onClick={() => toggle(k)}
            style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", cursor: "pointer", textAlign: "left", background: on ? T.goodSoft : T.card }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${on ? T.good : T.line}`, background: on ? T.good : "#fff", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, flex: "none" }}>{on ? "✓" : ""}</span>
            <span style={{ fontSize: 15, textDecoration: on ? "line-through" : "none" }}>{it}</span>
          </button>
        );
      })}
    </Col>
  );
}

/* ============ Quiz: multiple choice with instant feedback ============ */
export function Quiz({ questions }) {
  const [picked, setPicked] = useState({});   // { questionIndex: optionIndex }
  const score = questions.filter((q, k) => picked[k] === q.answer).length;
  const finished = Object.keys(picked).length === questions.length;
  return (
    <Col gap={10}>
      {questions.map((q, k) => (
        <div key={k} className="panel" style={{ padding: "10px 14px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{k + 1}. {q.q}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {q.options.map((opt, j) => {
              const answered = picked[k] !== undefined;
              const right = answered && j === q.answer;
              const wrong = picked[k] === j && j !== q.answer;
              return (
                <button key={j} className="btn small" onClick={() => setPicked({ ...picked, [k]: j })}
                  style={{ background: right ? T.goodSoft : wrong ? T.warnSoft : "#fff", borderColor: right ? T.good : wrong ? T.warn : T.line, color: right ? T.good : wrong ? T.warn : T.ink }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {picked[k] !== undefined && q.why && <div className="note pop" style={{ marginTop: 6 }}>{q.why}</div>}
        </div>
      ))}
      {finished && <div className="chip good pop" style={{ alignSelf: "flex-start" }}>{score} / {questions.length} correct</div>}
    </Col>
  );
}
