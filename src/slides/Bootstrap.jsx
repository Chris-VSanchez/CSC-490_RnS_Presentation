import { useState } from "react";
// ?url gives us the path to Bootstrap's real CSS file, bundled with the deck (no CDN needed)
import bootstrapCss from "bootstrap/dist/css/bootstrap.min.css?url";
import { T, Slide, Split, Col, Code } from "../ui.jsx";

const PURPLE = "#7952b3";
const ITEMS = [
  ["React", "A library for building user interfaces."],
  ["Vue", "The progressive JavaScript framework."],
  ["Svelte", "Compiles components to tiny JavaScript."],
];
const FEATURES = [
  { key: "grid", label: "Grid", cls: ".container .row .col", hint: "three responsive columns" },
  { key: "card", label: "Cards", cls: ".card .card-body", hint: "border, padding, rounded corners" },
  { key: "btn", label: "Buttons", cls: ".btn .btn-primary", hint: "styled, accessible buttons" },
  { key: "shadow", label: "Shadow", cls: ".shadow-sm", hint: "one utility class" },
];

function buildHtml(on) {
  const wrap = on.grid ? "container py-3" : "p-3";
  const row = on.grid ? "row g-3" : "";
  const col = on.grid ? "col" : "mb-3";
  const card = [on.card && "card h-100", on.shadow && "shadow-sm"].filter(Boolean).join(" ");
  const body = on.card ? "card-body" : "";
  const btn = on.btn ? "btn btn-primary btn-sm" : "";
  const attr = (c) => (c ? ` class="${c}"` : "");
  const cols = ITEMS.map(([t, d]) => `
    <div${attr(col)}>
      <div${attr(card)}>
        <div${attr(body)}>
          <h5${attr(on.card ? "card-title" : "")}>${t}</h5>
          <p${attr(on.card ? "card-text text-secondary" : "")}>${d}</p>
          <a href="#"${attr(btn)}>Learn more</a>
        </div>
      </div>
    </div>`).join("");
  return `<div${attr(wrap)}>\n  <div${attr(row)}>${cols}\n  </div>\n</div>`;
}

function snippet(on) {
  // What one column looks like in code (shown next to the live preview)
  const c = (s) => (s ? ` class="${s}"` : "");
  return `<div${c(on.grid ? "row" : "")}>
  <div${c(on.grid ? "col" : "")}>
    <div${c([on.card && "card", on.shadow && "shadow-sm"].filter(Boolean).join(" "))}>
      <div${c(on.card ? "card-body" : "")}>
        <h5>React</h5>
        <p>A library for building user interfaces.</p>
        <a${c(on.btn ? "btn btn-primary" : "")}>Learn more</a>
      </div>
    </div>
  </div>  <!-- + 2 more -->
</div>`;
}

export function BootstrapSlide() {
  const [on, setOn] = useState({ grid: true, card: true, btn: true, shadow: false });
  const cssHref = new URL(bootstrapCss, window.location.href).href;
  const doc = `<!doctype html><html><head><link rel="stylesheet" href="${cssHref}"><style>body{background:#fff}</style></head><body>${buildHtml(on)}</body></html>`;
  return (
    <Slide kicker="CSS frameworks" title="Bootstrap: design by adding class names">
      <Split cols="1fr 1.15fr">
        <Col gap={12}>
          <div className="panel" style={{ padding: "12px 16px", borderLeft: `5px solid ${PURPLE}` }}>
            <div style={{ fontWeight: 800, color: PURPLE }}>Built at Twitter, 2011</div>
            <div style={{ fontSize: 15, lineHeight: 1.5, marginTop: 4 }}>
              Mark Otto and Jacob Thornton made “Twitter Blueprint” to keep internal tools consistent, then open-sourced it as Bootstrap. Bootstrap 5 (2021) dropped jQuery.
            </div>
          </div>
          <div className="note">Toggle a feature. Same HTML, different classes:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {FEATURES.map((f) => (
              <button key={f.key} className="panel" onClick={() => setOn({ ...on, [f.key]: !on[f.key] })}
                style={{ padding: "8px 12px", textAlign: "left", cursor: "pointer", borderColor: on[f.key] ? PURPLE : T.line, background: on[f.key] ? "#f6f1fd" : "#fff" }}>
                <div style={{ fontWeight: 700, color: on[f.key] ? PURPLE : T.ink }}>{on[f.key] ? "✓ " : ""}{f.label}</div>
                <div className="mono" style={{ fontSize: 12, color: T.muted }}>{f.cls}</div>
              </button>
            ))}
          </div>
          <Code size={12.5}>{snippet(on)}</Code>
        </Col>
        <Col gap={12}>
          <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
            <div className="note" style={{ padding: "6px 12px", borderBottom: `1px solid ${T.line}`, fontSize: 12 }}>live preview, real Bootstrap 5 CSS</div>
            <iframe title="Bootstrap preview" srcDoc={doc} style={{ width: "100%", height: 330, border: 0, display: "block" }} />
          </div>
          <div className="callout info"><div className="h">The other big approach: Tailwind CSS</div>
            Instead of components like <span className="mono">.card</span>, you combine small utilities: <span className="mono" style={{ fontSize: 14 }}>p-4 rounded-xl shadow bg-white</span>. Bootstrap is faster to start with; Tailwind gives more control.
          </div>
        </Col>
      </Split>
    </Slide>
  );
}
