import { useState } from "react";
import { T, Slide, Split, Col, Code, Quiz, Term, useDeck } from "../ui.jsx";
import { DOMAIN, PRESENTER } from "../config.js";

/* ============ More niche libraries ============ */
const LIBS = [
  { name: "D3.js", tag: "Data visualization", color: T.blue,
    what: "Binds data to SVG and HTML so you can build any chart from scratch. Created by Mike Bostock in 2011; the base for a lot of newsroom graphics.",
    code: `d3.select("svg")
  .selectAll("rect")
  .data(scores)
  .join("rect")
  .attr("height", (d) => d * 10)` },
  { name: "GSAP", tag: "Animation", color: T.good,
    what: "A timeline-based animation engine that is smooth on any browser. Webflow acquired it in 2024, and since 2025 it is free for all uses, including commercial ones.",
    code: `gsap.to(".logo", {
  x: 300,
  rotation: 360,
  duration: 1.2,
  ease: "bounce.out",
})` },
  { name: "Chart.js", tag: "Quick charts", color: "#e11d48",
    what: "Ready-made bar, line and pie charts on a <canvas>. Far less control than D3, far less code.",
    code: `new Chart(canvas, {
  type: "bar",
  data: {
    labels: ["React", "Vue", "Svelte"],
    datasets: [{ data: [42, 18, 7] }],
  },
})` },
  { name: "Matter.js", tag: "2D physics", color: T.amber,
    what: "Gravity, collisions and friction for falling boxes, ragdolls and browser games.",
    code: `const box = Bodies.rectangle(200, 0, 80, 80)
const ground = Bodies.rectangle(400, 600, 810, 60, {
  isStatic: true,
})
Composite.add(engine.world, [box, ground])` },
  { name: "Howler.js", tag: "Audio", color: "#7952b3",
    what: "One simple API for sound effects and music across browsers, including the awkward mobile cases.",
    code: `const click = new Howl({ src: ["click.mp3"] })
button.addEventListener("click", () => click.play())` },
  { name: "Leaflet", tag: "Maps", color: T.accent,
    what: "Lightweight interactive maps with pan, zoom and markers, using free OpenStreetMap tiles.",
    code: `const map = L.map("map").setView([51.505, -0.09], 13)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")
  .addTo(map)
L.marker([51.5, -0.09]).addTo(map)` },
];

export function LibrariesSlide() {
  const [k, setK] = useState(0);
  const lib = LIBS[k];
  return (
    <Slide kicker="Niche libraries" title="A shelf of specialist tools" sub="Frameworks structure an app. Libraries like these do one job well. Click one.">
      <Split cols="1fr 1.2fr">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {LIBS.map((l, j) => (
            <button key={l.name} className="panel" onClick={() => setK(j)}
              style={{ textAlign: "left", cursor: "pointer", padding: "14px 16px", borderLeft: `5px solid ${l.color}`, background: j === k ? "#fff" : "#fafbfc", boxShadow: j === k ? `0 0 0 2px ${l.color}` : "none" }}>
              <div style={{ fontSize: 19, fontWeight: 800 }}>{l.name}</div>
              <div className="note">{l.tag}</div>
            </button>
          ))}
        </div>
        <Col key={k}>
          <div className="panel pop" style={{ borderTop: `5px solid ${lib.color}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: lib.color }}>{lib.name}</span>
              <span className="chip" style={{ background: "#eef0f3", color: T.muted }}>{lib.tag}</span>
            </div>
            <p className="lead" style={{ marginTop: 8, color: T.ink, fontSize: 17 }}>{lib.what}</p>
          </div>
          <Code size={14}>{lib.code}</Code>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ Plot twist: this deck is a React app ============ */
export function MetaSlide() {
  const { index, total } = useDeck();
  return (
    <Slide kicker="Plot twist" title="This presentation is a React app">
      <Split cols="1.2fr 1fr">
        <Col gap={12}>
          <Code file="src/App.jsx" size={12.5} hl={[3, 4, 5]}>{`import { DeckShell } from "./ui.jsx"

const SLIDES = [
  { el: <TitleSlide />, notes: "Introduce myself..." },
  { el: <HistorySlide />, id: "react" },
  // ...one entry per slide
]

export default function App() {
  return <DeckShell slides={SLIDES} />
}`}</Code>
          <Code file="src/ui.jsx (DeckShell)" size={12.5}>{`const [i, setI] = useState(0)        // current slide
useEffect(() => {
  const onKey = (e) => {
    if (e.key === "ArrowRight") setI(i + 1)
    if (e.key === "ArrowLeft") setI(i - 1)
  }
  window.addEventListener("keydown", onKey)
  return () => window.removeEventListener("keydown", onKey)
}, [i])`}</Code>
        </Col>
        <Col gap={12}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              [`${index + 1} / ${total}`, "read live from DeckShell"],
              ["0", "slide libraries used"],
              ["React + Vite", "built with"],
              ["Static", "hosted, no server"],
            ].map(([a, b]) => (
              <div key={b} className="panel" style={{ padding: "12px 14px" }}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: T.blue }}>{a}</div>
                <div className="note">{b}</div>
              </div>
            ))}
          </div>
          <Term title="deploy" height={150} start={1} script={[
            { cmd: "npm run build", out: "✓ built in 1.4s → dist/" },
            { cmd: "git push", out: "Vercel: building... deployed" },
            { cmd: `open https://${DOMAIN}`, out: "You are here." },
          ]} />
          <div className="callout good"><div className="h">Everything from today, in one project</div>React components and hooks, Bootstrap's real CSS, Three.js in WebGL, and a server you can run with Express.</div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ Quiz ============ */
export function QuizSlide() {
  return (
    <Slide kicker="Check yourself" title="Four quick questions">
      <Quiz questions={[
        { q: "Which company created React?", options: ["Google", "Meta (Facebook)", "Twitter", "Microsoft"], answer: 1, why: "Jordan Walke built it at Facebook; it was open-sourced in 2013." },
        { q: "What did Hooks (2019) make possible?", options: ["3D graphics", "State in function components", "Server routing", "CSS grids"], answer: 1, why: "useState and useEffect replaced most class components." },
        { q: "How do you style with Bootstrap?", options: ["Write a stylesheet per page", "Add pre-built class names", "Use inline styles only"], answer: 1, why: "Classes like .btn and .card carry the design." },
        { q: "Three.js draws 3D using which browser API?", options: ["Canvas 2D", "WebGL", "SVG", "Web Audio"], answer: 1, why: "It wraps WebGL so you don't have to write shaders and buffers by hand." },
      ]} />
    </Slide>
  );
}

/* ============ Thank you + sources ============ */
const SOURCES = [
  ["React blog: React 19, Compiler 1.0, React Foundation", "react.dev/blog"],
  ["“Why did we build React?” (2013)", "legacy.reactjs.org/blog/2013/06/05/why-react.html"],
  ["React documentation", "react.dev/learn"],
  ["Bootstrap: about and history", "getbootstrap.com/docs/5.3/about/overview"],
  ["Express documentation", "expressjs.com"],
  ["Three.js documentation", "threejs.org/docs"],
  ["Stack Overflow Developer Survey", "survey.stackoverflow.co"],
];

export function ThanksSlide() {
  const { goTo } = useDeck();
  return (
    <Slide>
      <Split cols="1fr 1.1fr" gap={48}>
        <Col gap={16}>
          <div className="kicker" style={{ marginTop: 40 }}>Thank you</div>
          <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.02 }}>Questions?</h1>
          <p className="lead">{PRESENTER} · CSC 490</p>
          <div className="panel" style={{ padding: "14px 18px" }}>
            <div className="note">These slides, live:</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.blue }}>{DOMAIN}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn small" onClick={() => goTo("react")}>Revisit React history</button>
            <button className="btn small" onClick={() => goTo("three")}>Back to the 3D demo</button>
          </div>
        </Col>
        <Col gap={8}>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 40 }}>Sources</div>
          {SOURCES.map(([title, url]) => (
            <a key={url} href={`https://${url}`} target="_blank" rel="noreferrer" className="panel"
              style={{ padding: "9px 14px", textDecoration: "none", color: T.ink, display: "block" }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
              <div className="mono note" style={{ fontSize: 12.5 }}>{url}</div>
            </a>
          ))}
        </Col>
      </Split>
    </Slide>
  );
}
