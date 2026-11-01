import { useState, useEffect, useRef } from "react";
import { T, Slide, Split, Col, Code, Tabs } from "../ui.jsx";

/* ============ 5. History of React ============ */
const EVENTS = [
  { year: "2011", label: "FaxJS", title: "A prototype inside Facebook",
    body: "Engineer Jordan Walke builds an early prototype (nicknamed FaxJS) to make Facebook's complex, constantly-updating UI easier to manage. It powers the News Feed in 2011 and Instagram.com in 2012." },
  { year: "2013", label: "Open source", title: "Released to the world at JSConf US",
    body: "React is open-sourced in May 2013. Many developers first push back on JSX (HTML mixed into JavaScript). That idea is now standard." },
  { year: "2015", label: "React Native", title: "React leaves the browser",
    body: "React Native applies the same component model to native iOS and Android apps. “Learn once, write anywhere.”" },
  { year: "2017", label: "Fiber + MIT", title: "React 16: a rewritten core",
    body: "The Fiber engine lets React split rendering into small chunks and prioritize urgent updates. The same year, React is relicensed under the MIT license." },
  { year: "2019", label: "Hooks", title: "React 16.8 introduces Hooks",
    body: "useState and useEffect give function components state and side effects. Class components fade out of new code almost overnight." },
  { year: "2022", label: "React 18", title: "Concurrent rendering",
    body: "React can now prepare updates in the background and interrupt them, plus automatic batching of state updates." },
  { year: "2024", label: "React 19", title: "Actions and Server Components",
    body: "React 19 (December 2024) makes Server Components stable and adds Actions for forms and data mutations, plus the new use() API." },
  { year: "2025", label: "Compiler 1.0", title: "React Compiler 1.0",
    body: "Released October 2025: the compiler memoizes components automatically, so you write less useMemo and useCallback. Create React App is officially deprecated in favor of frameworks and Vite." },
  { year: "2026", label: "Foundation", title: "The React Foundation",
    body: "Announced at React Conf in October 2025 and launched in February 2026 under the Linux Foundation, so React is no longer governed by Meta alone." },
];

export function HistorySlide() {
  const [k, setK] = useState(1);
  const e = EVENTS[k];
  return (
    <Slide kicker="React: history" title="From an internal prototype to a foundation" sub="Click any year.">
      <div style={{ position: "relative", padding: "8px 10px 0" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 4, background: T.line, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 40, top: 30, height: 4, background: T.blue, borderRadius: 2, width: `calc((100% - 80px) * ${k / (EVENTS.length - 1)})`, transition: "width .25s" }} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${EVENTS.length}, 1fr)`, position: "relative" }}>
          {EVENTS.map((ev, j) => (
            <button key={ev.year} className="dot-btn" onClick={() => setK(j)} aria-label={`${ev.year}: ${ev.label}`}>
              <div style={{ width: 22, height: 22, borderRadius: 11, margin: "11px auto 10px", background: j <= k ? T.blue : "#fff", border: `3px solid ${j <= k ? T.blue : "#c9ced6"}`, boxShadow: j === k ? `0 0 0 6px ${T.blueSoft}` : "none" }} />
              <div className="mono" style={{ fontWeight: 700, fontSize: 16, color: j === k ? T.blue : T.ink }}>{ev.year}</div>
              <div className="note" style={{ fontSize: 13 }}>{ev.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="panel pop" key={k} style={{ marginTop: 26, padding: "22px 26px", borderLeft: `6px solid ${T.blue}`, display: "grid", gridTemplateColumns: "150px 1fr", gap: 24, alignItems: "center" }}>
        <div className="mono" style={{ fontSize: 52, fontWeight: 700, color: T.blue }}>{e.year}</div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{e.title}</div>
          <p className="lead" style={{ marginTop: 8, fontSize: 18, color: T.ink }}>{e.body}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button className="btn small" disabled={k === 0} onClick={() => setK(k - 1)}>← Earlier</button>
        <button className="btn small" disabled={k === EVENTS.length - 1} onClick={() => setK(k + 1)}>Later →</button>
      </div>
    </Slide>
  );
}

/* ============ 6. Components + props ============ */
const ROLES = { Student: T.blue, Developer: T.accent, Designer: "#7952b3" };

function ProfileCard({ name, role, online }) {
  return (
    <div className="panel" style={{ display: "flex", gap: 16, alignItems: "center", padding: 18 }}>
      <div style={{ position: "relative", flex: "none" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: ROLES[role], color: "#fff", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800 }}>
          {(name.trim()[0] || "?").toUpperCase()}
        </div>
        <span style={{ position: "absolute", right: 0, bottom: 2, width: 16, height: 16, borderRadius: 8, border: "3px solid #fff", background: online ? "#22c55e" : "#9ca3af" }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "Anonymous"}</div>
        <span className="chip" style={{ background: "#eef0f3", color: ROLES[role], marginTop: 4 }}>{role}</span>
        <span className="note" style={{ marginLeft: 8 }}>{online ? "Online" : "Away"}</span>
      </div>
    </div>
  );
}

export function ComponentsSlide() {
  const [name, setName] = useState("Chris");
  const [role, setRole] = useState("Developer");
  const [online, setOnline] = useState(true);
  const code = `function ProfileCard({ name, role, online }) {
  return (
    <div className="card">
      <Avatar letter={name[0]} online={online} />
      <h3>{name}</h3>
      <span className="chip">{role}</span>
    </div>
  )
}

// Use it like an HTML tag. Props go in, UI comes out.
<ProfileCard name="${name}" role="${role}" online={${online}} />`;
  return (
    <Slide kicker="React: big idea 1" title="Components are functions. Props are their inputs.">
      <Split cols="1.25fr 1fr">
        <Code file="ProfileCard.jsx" hl={[12]} size={14}>{code}</Code>
        <Col>
          <div className="note">Change the props. The card and the code update together.</div>
          <ProfileCard name={name} role={role} online={online} />
          <div className="panel" style={{ display: "grid", gap: 12 }}>
            <label className="note">name
              <input className="field" type="text" value={name} maxLength={18} onChange={(e) => setName(e.target.value)} style={{ marginTop: 4 }} />
            </label>
            <div>
              <div className="note" style={{ marginBottom: 4 }}>role</div>
              <Tabs options={Object.keys(ROLES)} value={role} onChange={setRole} />
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15, cursor: "pointer" }}>
              <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> online
            </label>
          </div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ 7. Virtual DOM + reconciliation ============ */
const START = [
  { id: 1, text: "React" }, { id: 2, text: "Vue" }, { id: 3, text: "Angular" }, { id: 4, text: "Svelte" },
];
const EXTRA = ["Solid", "Preact", "Qwik", "Lit", "Ember", "Alpine"];

// Compare two keyed lists the way React's reconciler does (simplified)
function diff(prev, next) {
  const ops = [];
  const before = new Map(prev.map((x, k) => [x.id, { ...x, k }]));
  const after = new Set(next.map((x) => x.id));
  prev.forEach((x) => { if (!after.has(x.id)) ops.push({ kind: "remove", text: `remove <li key=${x.id}> "${x.text}"` }); });
  const kept = prev.filter((x) => after.has(x.id)).map((x) => x.id);
  next.forEach((x, k) => {
    const old = before.get(x.id);
    if (!old) ops.push({ kind: "insert", text: `insert <li key=${x.id}> "${x.text}"` });
    else if (old.text !== x.text) ops.push({ kind: "update", text: `update text of key=${x.id}: "${old.text}" → "${x.text}"` });
  });
  const keptNext = next.filter((x) => before.has(x.id)).map((x) => x.id);
  if (kept.join() !== keptNext.join()) ops.push({ kind: "move", text: "move existing <li>s into the new order (no re-create)" });
  return ops;
}

const OP_COLOR = { insert: T.good, remove: T.warn, update: T.amber, move: T.blue, info: T.muted };

export function VirtualDomSlide() {
  const [items, setItems] = useState(START);
  const [log, setLog] = useState([{ kind: "info", text: "first render: create <ul> + 4 <li>" }]);
  const [changed, setChanged] = useState(new Set());
  const [ver, setVer] = useState(0);
  const nextId = useRef(5);

  const apply = (label, next) => {
    const ops = diff(items, next);
    setItems(next);
    setVer((v) => v + 1);
    setChanged(new Set(next.filter((x) => { const o = items.find((p) => p.id === x.id); return !o || o.text !== x.text; }).map((x) => x.id)));
    setLog((l) => [{ kind: "info", text: `— ${label}: ${ops.length} DOM ${ops.length === 1 ? "change" : "changes"}` }, ...ops, ...l].slice(0, 9));
  };
  const add = () => { const id = nextId.current++; apply("add", [...items, { id, text: EXTRA[(id - 5) % EXTRA.length] }]); };
  const remove = () => items.length && apply("remove first", items.slice(1));
  const rename = () => items.length && apply("rename", items.map((x, k) => (k === items.length - 1 ? { ...x, text: x.text.endsWith("!") ? x.text.slice(0, -1) : x.text + "!" } : x)));
  const shuffle = () => apply("reverse", [...items].reverse());

  return (
    <Slide kicker="React: big idea 2" title="The virtual DOM: change only what changed" sub="React renders to a lightweight copy first, compares it to the last one, then patches the real page.">
      <Split cols="1fr 1.25fr">
        <Col>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button className="btn small primary" onClick={add}>+ Add</button>
            <button className="btn small" onClick={remove}>Remove first</button>
            <button className="btn small" onClick={rename}>Rename last</button>
            <button className="btn small" onClick={shuffle}>Reverse</button>
          </div>
          <div className="panel" style={{ padding: 12 }}>
            <div className="note mono" style={{ marginBottom: 6 }}>{"<ul>"}  the real page</div>
            {items.map((x) => (
              <div key={`${x.id}-${changed.has(x.id) ? ver : 0}`} className={changed.has(x.id) ? "flash" : ""}
                style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", borderRadius: 8, fontSize: 16 }}>
                <span>{x.text}</span><span className="mono note">key={x.id}</span>
              </div>
            ))}
            {items.length === 0 && <div className="note">(empty)</div>}
          </div>
        </Col>
        <Col>
          <div className="code" style={{ padding: "12px 16px", fontSize: 14, minHeight: 300 }}>
            <div className="file" style={{ padding: "0 0 8px" }}>what React actually does to the DOM</div>
            {log.map((o, k) => (
              <div key={k} style={{ color: o.kind === "info" ? "#8b97a7" : "#e5e9ef", whiteSpace: "pre-wrap", marginTop: o.kind === "info" && k ? 8 : 2 }}>
                {o.kind !== "info" && <span style={{ color: OP_COLOR[o.kind], fontWeight: 700 }}>{o.kind.padEnd(7)}</span>}
                {o.kind === "info" ? o.text : o.text.replace(/^\w+ /, "")}
              </div>
            ))}
          </div>
          <div className="callout info"><div className="h">Why keys matter</div>The key tells React which item is which. On Reverse it moves the existing elements instead of destroying and re-creating them.</div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ 8. Hooks ============ */
const HOOK_CODE = `function Stopwatch() {
  const [running, setRunning] = useState(false)
  const [ms, setMs] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setMs((t) => t + 100), 100)
    return () => clearInterval(id)   // cleanup
  }, [running])

  return (
    <button onClick={() => setRunning(!running)}>
      {(ms / 1000).toFixed(1)}s
    </button>
  )
}`;

export function HooksSlide() {
  const [running, setRunning] = useState(false);
  const [ms, setMs] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [events, setEvents] = useState(["render: running = false, ms = 0"]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setMs((t) => t + 100), 100);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    const next = !running;
    setRunning(next);
    setPhase(next ? "start" : "stop");
    setEvents((e) => [next ? "click → setRunning(true) → effect starts an interval" : "click → setRunning(false) → cleanup clears the interval", ...e].slice(0, 5));
  };
  const hl = { idle: [2, 3], start: [5, 6, 7, 9], stop: [8] }[phase];

  return (
    <Slide kicker="React: big idea 3 (2019)" title="Hooks: state and side effects in a function">
      <Split cols="1.25fr 1fr">
        <Code file="Stopwatch.jsx" hl={hl} dim size={14}>{HOOK_CODE}</Code>
        <Col>
          <div className="panel" style={{ textAlign: "center", padding: 24 }}>
            <div className="mono" style={{ fontSize: 64, fontWeight: 700 }}>{(ms / 1000).toFixed(1)}s</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <button className="btn primary" onClick={toggle}>{running ? "Stop" : "Start"}</button>
              <button className="btn" onClick={() => { setMs(0); setEvents((e) => ["setMs(0) → re-render", ...e].slice(0, 5)); }}>Reset</button>
            </div>
          </div>
          <div className="panel" style={{ padding: "10px 14px" }}>
            {events.map((t, k) => <div key={events.length - k} className={"mono" + (k === 0 ? " pop" : "")} style={{ fontSize: 13, color: k ? T.muted : T.ink, padding: "3px 0" }}>{t}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="callout info" style={{ fontSize: 15 }}><div className="h">useState</div>A value that survives re-renders. Setting it re-draws the UI.</div>
            <div className="callout good" style={{ fontSize: 15 }}><div className="h">useEffect</div>Sync with the outside world: timers, fetch, subscriptions.</div>
          </div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ 9. React in the real world ============ */
const SURFACES = [
  { name: "Web apps", tool: "Next.js · React Router · Vite", who: "Facebook, Netflix, Airbnb", color: T.blue },
  { name: "Mobile apps", tool: "React Native · Expo", who: "Instagram, Discord, Shopify", color: T.accent },
  { name: "Desktop apps", tool: "Electron + React", who: "Discord desktop, many internal tools", color: "#7952b3" },
  { name: "On the server", tool: "Server Components · SSR", who: "Next.js App Router renders React on the server", color: T.amber },
];
const META = [
  ["Next.js", "2016", "Vercel", "Full-stack React: routing, server rendering, API routes"],
  ["React Router", "2014", "Ryan Florence & Michael Jackson", "Routing; v7 (2024) merged in Remix's framework features"],
  ["Expo", "2015–16", "Charlie Cheever & James Ide", "React Native tooling: build and ship mobile apps"],
  ["Vite", "2020", "Evan You", "Fast dev server + build tool (this deck uses it)"],
];

export function RealWorldSlide() {
  const [view, setView] = useState("Where it runs");
  return (
    <Slide kicker="React today" title="One mental model, many platforms">
      <Tabs options={["Where it runs", "Frameworks built on React"]} value={view} onChange={setView} />
      {view === "Where it runs" ? (
        <div className="pop" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 16 }}>
          {SURFACES.map((s) => (
            <div key={s.name} className="panel" style={{ borderTop: `5px solid ${s.color}`, minHeight: 210 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.name}</div>
              <div className="mono" style={{ fontSize: 13, color: s.color, marginTop: 8, fontWeight: 700 }}>{s.tool}</div>
              <p className="lead" style={{ fontSize: 16, marginTop: 10 }}>{s.who}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel pop" style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead><tr style={{ background: "#f8f9fb" }}>{["Tool", "Since", "From", "What it adds"].map((h) => <th key={h} className="note" style={{ textAlign: "left", padding: "10px 16px", textTransform: "uppercase", fontSize: 12, letterSpacing: ".06em" }}>{h}</th>)}</tr></thead>
            <tbody>{META.map(([a, b, c, d]) => <tr key={a} style={{ borderTop: `1px solid ${T.line}` }}><td style={{ padding: "12px 16px", fontWeight: 700 }}>{a}</td><td className="mono" style={{ padding: "12px 16px" }}>{b}</td><td style={{ padding: "12px 16px" }}>{c}</td><td style={{ padding: "12px 16px" }}>{d}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
        <div className="callout good"><div className="h">Why it won</div>A small core, a huge ecosystem, and skills that transfer from web to mobile. It is consistently one of the most-used web frameworks in the Stack Overflow Developer Survey.</div>
        <div className="callout"><div className="h">Honest trade-offs</div>React is a library, not a full framework: you pick routing, data and styling yourself. That freedom is also the learning curve.</div>
      </div>
    </Slide>
  );
}
