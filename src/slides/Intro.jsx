import { useState } from "react";
import { T, Slide, Split, Col, Code, Tabs, useDeck } from "../ui.jsx";
import { PRESENTER } from "../config.js";

/* ============ 1. Title ============ */
export function TitleSlide() {
  const [name, setName] = useState("");
  const [renders, setRenders] = useState(0);
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "1.15fr 1fr", alignItems: "center", gap: 48, padding: "0 80px" }}>
      <div>
        <div className="kicker">CSC 490 | Solo R&amp;S Presentation | {PRESENTER}</div>
        <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.0 }}>Building the Modern Web</h1>
        <p className="lead" style={{ marginTop: 22, maxWidth: 540 }}>
          React, the frameworks around it, and the tools that turn a folder of JavaScript into a real website.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
          <span className="chip blue">React</span>
          <span className="chip" style={{ background: "#f1ebfa", color: "#7952b3" }}>Bootstrap</span>
          <span className="chip">Express</span>
          <span className="chip amber">Three.js</span>
        </div>
      </div>
      <div className="panel" style={{ padding: 32 }}>
        <div className="note" style={{ marginBottom: 10 }}>This slide is a React component. Try it:</div>
        <input className="field" type="text" placeholder="Type your name" value={name}
          onChange={(e) => { setName(e.target.value); setRenders((r) => r + 1); }} />
        <div style={{ fontSize: 44, fontWeight: 800, marginTop: 22, lineHeight: 1.1, minHeight: 100, overflowWrap: "anywhere" }}>
          Hello, <span style={{ color: T.blue }}>{name || "class"}</span>
        </div>
        <div className="note" style={{ marginTop: 10 }}>
          React re-drew that greeting <b className="mono" style={{ color: T.ink }}>{renders}</b> {renders === 1 ? "time" : "times"}. You never touched the DOM.
        </div>
      </div>
    </div>
  );
}

/* ============ 2. Roadmap ============ */
const PARTS = [
  { id: "react", name: "React", desc: "Where it came from, the big ideas, and where it runs today", color: T.blue, mins: "8 min" },
  { id: "bootstrap", name: "CSS frameworks", desc: "Bootstrap: styling with class names", color: "#7952b3", mins: "2 min" },
  { id: "express", name: "Express", desc: "A Node.js server for your API and your built app", color: T.accent, mins: "3 min" },
  { id: "three", name: "Niche libraries", desc: "Three.js in 3D, plus a shelf of fun tools", color: T.amber, mins: "3 min" },
];

export function RoadmapSlide() {
  const { goTo } = useDeck();
  return (
    <Slide kicker="Roadmap" title="Four stops on today's tour" sub="Click a card to jump straight to that section.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {PARTS.map((p, k) => (
          <button key={p.id} className="panel" onClick={() => goTo(p.id)}
            style={{ textAlign: "left", cursor: "pointer", borderTop: `5px solid ${p.color}`, minHeight: 230, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 34, fontWeight: 700, color: p.color }}>0{k + 1}</span>
              <span className="chip" style={{ background: "#eef0f3", color: T.muted }}>{p.mins}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 14 }}>{p.name}</div>
            <p className="lead" style={{ marginTop: 8, fontSize: 17 }}>{p.desc}</p>
          </button>
        ))}
      </div>
      <div className="callout info" style={{ marginTop: 22 }}>
        <div className="h">The thread through all of it</div>
        Every slide in this deck is a live React component, so each tool I talk about is running in front of you.
      </div>
    </Slide>
  );
}

/* ============ 3. Why frameworks exist ============ */
const VANILLA = `// Vanilla JavaScript: tell the browser every step
const btn = document.querySelector("#like")
const label = document.querySelector("#count")
let likes = 0

btn.addEventListener("click", () => {
  likes = likes + 1
  label.textContent = likes          // step 1: update text
  btn.classList.toggle("liked", true) // step 2: update style
  // forget a step and the page is out of sync
})`;

const REACT = `// React: describe what the UI should look like
function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button
      className={likes > 0 ? "liked" : ""}
      onClick={() => setLikes(likes + 1)}>
      ♥ {likes}
    </button>
  )
}`;

export function WhySlide() {
  const [tab, setTab] = useState("Vanilla JS");
  const [likes, setLikes] = useState(0);
  return (
    <Slide kicker="Why frameworks exist" title="From “change this, then that” to “here is the UI”">
      <Split cols="1.25fr 1fr">
        <Col>
          <Tabs options={["Vanilla JS", "React"]} value={tab} onChange={setTab} />
          <Code file={tab === "React" ? "LikeButton.jsx" : "like.js"} size={14}>{tab === "React" ? REACT : VANILLA}</Code>
        </Col>
        <Col>
          <div className="panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>The same button, live</div>
              <div className="note">Both versions produce this.</div>
            </div>
            <button className="btn" onClick={() => setLikes(likes + 1)}
              style={{ fontSize: 20, padding: "10px 20px", color: likes ? "#e11d48" : T.ink, borderColor: likes ? "#fda4af" : T.line, background: likes ? "#fff1f2" : "#fff" }}>
              ♥ {likes}
            </button>
          </div>
          <div className="callout"><div className="h">Imperative (vanilla)</div>You write each DOM change by hand. As an app grows, keeping the screen and the data in sync is where the bugs live.</div>
          <div className="callout good"><div className="h">Declarative (React)</div>You describe the result for any value of the data. When the data changes, React works out which DOM changes to make.</div>
        </Col>
      </Split>
    </Slide>
  );
}

/* ============ 4. The landscape ============ */
const FRAMEWORKS = {
  React: {
    year: "2013", who: "Meta (Jordan Walke)", how: "Virtual DOM: re-run the component, diff the result, patch the page.", color: T.blue,
    code: `import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`,
  },
  Vue: {
    year: "2014", who: "Evan You (ex-Google)", how: "Reactive refs plus a virtual DOM. Templates look like plain HTML.", color: T.good,
    code: `<script setup>
import { ref } from "vue"
const count = ref(0)
</script>

<template>
  <button @click="count++">
    Count: {{ count }}
  </button>
</template>`,
  },
  Angular: {
    year: "2016 (AngularJS: 2010)", who: "Google", how: "A full framework: TypeScript, routing, forms and dependency injection included.", color: "#dd0031",
    code: `@Component({
  selector: "app-counter",
  template: \`
    <button (click)="count = count + 1">
      Count: {{ count }}
    </button>\`,
})
export class CounterComponent {
  count = 0
}`,
  },
  Svelte: {
    year: "2016", who: "Rich Harris", how: "A compiler: turns components into small, direct DOM updates at build time. No virtual DOM.", color: "#ff3e00",
    code: `<script>
  let count = $state(0)
</script>

<button onclick={() => count++}>
  Count: {count}
</button>`,
  },
};

export function LandscapeSlide() {
  const [pick, setPick] = useState("React");
  const f = FRAMEWORKS[pick];
  return (
    <Slide kicker="The landscape" title="Same counter, four frameworks">
      <Split cols="1.2fr 1fr">
        <Col>
          <Tabs options={Object.keys(FRAMEWORKS)} value={pick} onChange={setPick} />
          <Code file={`Counter (${pick})`} size={14}>{f.code}</Code>
        </Col>
        <Col>
          <div className="panel pop" key={pick} style={{ borderTop: `5px solid ${f.color}` }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: f.color }}>{pick}</div>
            <table style={{ marginTop: 10, fontSize: 16, lineHeight: 1.5, borderSpacing: "0 6px" }}>
              <tbody>
                <tr><td className="note" style={{ width: 110 }}>First release</td><td style={{ fontWeight: 600 }}>{f.year}</td></tr>
                <tr><td className="note">Created by</td><td style={{ fontWeight: 600 }}>{f.who}</td></tr>
                <tr><td className="note" style={{ verticalAlign: "top" }}>How it updates</td><td>{f.how}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="callout info">
            <div className="h">What they all share</div>
            Components, state that drives the UI, and a build step. Learn one well and the others feel familiar.
          </div>
        </Col>
      </Split>
    </Slide>
  );
}
