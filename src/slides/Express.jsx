import { useState } from "react";
import { T, Slide, Split, Col, Code, Term } from "../ui.jsx";
import { DOMAIN } from "../config.js";

/* ============ Express: a simulated server you can send requests to ============ */
const SERVER = `import express from "express"
const app = express()

app.use((req, res, next) => {        // middleware
  console.log(req.method, req.url)
  next()
})

app.get("/api/frameworks", (req, res) => {
  res.json(frameworks)
})

app.get("/api/frameworks/:id", (req, res) => {
  const fw = frameworks.find((f) => f.id === Number(req.params.id))
  if (!fw) return res.status(404).json({ error: "Not found" })
  res.json(fw)
})

app.listen(3000)`;

const DATA = [
  { id: 1, name: "React", year: 2013 },
  { id: 2, name: "Vue", year: 2014 },
  { id: 3, name: "Svelte", year: 2016 },
];

// Which lines run, and what comes back, for each request
function handle(path) {
  const mw = [4, 5, 6];
  if (path === "/api/frameworks") return { lines: [...mw, 9, 10], status: 200, body: JSON.stringify(DATA, null, 2) };
  const m = path.match(/^\/api\/frameworks\/(\w+)$/);
  if (m) {
    const fw = DATA.find((f) => f.id === Number(m[1]));
    return fw
      ? { lines: [...mw, 13, 14, 16], status: 200, body: JSON.stringify(fw, null, 2), params: m[1] }
      : { lines: [...mw, 13, 14, 15], status: 404, body: JSON.stringify({ error: "Not found" }, null, 2), params: m[1], err: true };
  }
  return { lines: mw, status: 404, body: `Cannot GET ${path}`, err: true, none: true };
}

const REQUESTS = ["/api/frameworks", "/api/frameworks/1", "/api/frameworks/99", "/about"];

export function ExpressSlide() {
  const [path, setPath] = useState(REQUESTS[0]);
  const [log, setLog] = useState(["Server listening on http://localhost:3000", "GET /api/frameworks"]);
  const r = handle(path);
  const send = (p) => { setPath(p); setLog((l) => [...l, `GET ${p}`].slice(-4)); };
  return (
    <Slide kicker="Servers" title="Express: a web server in about 20 lines">
      <Split cols="1.2fr 1fr">
        <Code file="server.js" hl={r.lines} err={r.err && !r.none ? [15] : []} dim size={13}>{SERVER}</Code>
        <Col gap={10}>
          <div className="note">Send a request (simulated in the browser):</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {REQUESTS.map((p) => (
              <button key={p} className={"btn small mono" + (p === path ? " on" : "")} onClick={() => send(p)} style={{ fontSize: 12.5 }}>GET {p}</button>
            ))}
          </div>
          <div className="panel pop" key={path} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: `1px solid ${T.line}` }}>
              <span className="mono" style={{ fontSize: 13 }}>GET {path}</span>
              <span className={"chip " + (r.status === 200 ? "good" : "warn")}>{r.status} {r.status === 200 ? "OK" : "Not Found"}</span>
            </div>
            <pre className="mono" style={{ margin: 0, padding: "10px 14px", fontSize: 13, lineHeight: 1.45, maxHeight: 190, overflow: "auto" }}>{r.body}</pre>
            {r.params && <div className="note mono" style={{ padding: "0 14px 10px", fontSize: 12 }}>req.params.id = "{r.params}" (a string, so Number() it)</div>}
          </div>
          <div className="term" style={{ padding: "10px 14px", fontSize: 13 }}>
            {log.map((t, k) => <div key={k}><span className="prompt">{k === 0 && t.startsWith("Server") ? "" : "› "}</span>{t}</div>)}
          </div>
          <div className="note">Created by TJ Holowaychuk in 2010. The “E” in the MERN stack. Express 5 shipped in 2024.</div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ Hosting: local with Express, public with a static host ============ */
function Box({ title, sub, color }) {
  return (
    <div className="panel" style={{ padding: "12px 14px", borderTop: `4px solid ${color}`, textAlign: "center" }}>
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div className="note mono" style={{ fontSize: 12 }}>{sub}</div>
    </div>
  );
}
const Arrow = ({ label }) => (
  <div style={{ textAlign: "center", color: T.muted, fontSize: 12 }}>
    <div className="mono">{label}</div><div style={{ fontSize: 20, lineHeight: 1 }}>⇄</div>
  </div>
);

export function HostingSlide() {
  return (
    <Slide kicker="Hosting" title="From your laptop to a real domain">
      <Split cols="1fr 1fr">
        <Col gap={12}>
          <div style={{ fontWeight: 800, color: T.accent }}>1. Local: Express serves everything</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "center", gap: 8 }}>
            <Box title="Browser" sub="React UI" color={T.blue} />
            <Arrow label="HTTP" />
            <Box title="Express" sub="localhost:3000" color={T.accent} />
            <Arrow label="query" />
            <Box title="Data" sub="JSON / DB" color={T.amber} />
          </div>
          <Code file="server.js" size={13}>{`app.use(express.static("dist"))   // the built React app
app.get("/api/frameworks", ...)    // your data API
app.listen(3000)`}</Code>
          <Term title="terminal" height={150} start={1} script={[
            { cmd: "npm run build", out: "vite build\n✓ dist/index.html + assets in 1.2s" },
            { cmd: "node server.js", out: "Server listening on http://localhost:3000" },
          ]} />
        </Col>
        <Col gap={12}>
          <div style={{ fontWeight: 800, color: T.blue }}>2. Public: a static host + your domain</div>
          <div className="panel" style={{ fontSize: 15, lineHeight: 1.6 }}>
            {[
              ["Build", "npm run build turns this deck into plain HTML, CSS and JS in dist/"],
              ["Deploy", "Push to GitHub; Vercel or Netlify builds it on every push"],
              ["Domain", "Point your domain's DNS at the host, HTTPS is automatic"],
            ].map(([a, b], k) => (
              <div key={a} style={{ display: "flex", gap: 10, padding: "6px 0" }}>
                <span style={{ width: 24, height: 24, borderRadius: 12, background: T.blue, color: "#fff", fontWeight: 800, fontSize: 13, display: "grid", placeItems: "center", flex: "none" }}>{k + 1}</span>
                <span><b>{a}:</b> {b}</span>
              </div>
            ))}
          </div>
          <div className="callout good"><div className="h">You're looking at it</div>This deck has no server code, so it is hosted as static files at <b className="mono">{DOMAIN}</b>.</div>
          <div className="callout info"><div className="h">When you need Express in production</div>Logins, databases or secret API keys need a server. Hosts like Render or Railway run Node apps.</div>
        </Col>
      </Split>
    </Slide>
  );
}
