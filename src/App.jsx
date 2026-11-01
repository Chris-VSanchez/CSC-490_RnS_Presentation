import { DeckShell } from "./ui.jsx";
import { TitleSlide, RoadmapSlide, WhySlide, LandscapeSlide } from "./slides/Intro.jsx";
import { HistorySlide, ComponentsSlide, VirtualDomSlide, HooksSlide, RealWorldSlide } from "./slides/React.jsx";
import { BootstrapSlide } from "./slides/Bootstrap.jsx";
import { ExpressSlide, HostingSlide } from "./slides/Express.jsx";
import { ThreeSlide } from "./slides/Three.jsx";
import { LibrariesSlide, MetaSlide, QuizSlide, ThanksSlide } from "./slides/Closing.jsx";

/* ------------------------------------------------------------------
   CSC 490 | Solo R&S Presentation | Building the Modern Web
   Order of this list = order of the presentation.
   id: lets other slides jump here with goTo("id").
   notes: what to say. Press N while presenting to see them.
------------------------------------------------------------------- */
const SLIDES = [
  { el: <TitleSlide />, notes: "Introduce yourself and the topic. Type a classmate's name into the box: the greeting updates and the counter goes up. Point out that the slide is a React component and you never touched the DOM yourself." },
  { el: <RoadmapSlide />, notes: "Name the four parts. Explain why you chose this topic: you are passionate about web development and wanted the slides themselves to be the demo. You can click a card to jump to its section." },
  { el: <WhySlide />, notes: "Start on Vanilla JS. Point at the two manual steps on lines 8 and 9. Click the heart. Switch to React: same result, but you only describe the UI. Key words: imperative vs declarative." },
  { el: <LandscapeSlide />, notes: "Click through all four tabs. The goal is not to pick a winner. Every framework has components and state; they differ in how they update the page. React uses a virtual DOM, Svelte compiles it away." },
  { el: <HistorySlide />, id: "react", notes: "Walk the timeline left to right with Later. Stress three moments: 2013 open source, 2019 Hooks, 2026 React Foundation (no longer just Meta's project)." },
  { el: <ComponentsSlide />, notes: "Type a classmate's name and change the role. The card and line 12 of the code change together. Props in, UI out: a component is just a function." },
  { el: <VirtualDomSlide />, notes: "Click Add, then Rename last, then Reverse. Read the log: React only inserts, updates or moves what changed. Keys are how it knows which item is which." },
  { el: <HooksSlide />, notes: "Press Start: the highlighted lines show the effect creating an interval. Press Stop: line 8, the cleanup, runs. Hooks came in 2019 and replaced class components." },
  { el: <RealWorldSlide />, notes: "Web, mobile, desktop, server: same component model. Flip to the frameworks tab: Next.js, React Router, Expo, Vite. End with the honest trade-offs." },
  { el: <BootstrapSlide />, id: "bootstrap", notes: "Turn the features off one by one until it is plain HTML, then back on. The HTML structure never changes; only class names do. Mention Tailwind as the utility-first alternative." },
  { el: <ExpressSlide />, id: "express", notes: "Click each request. Watch which lines highlight: middleware runs every time, then the matching route. /api/frameworks/99 hits the 404 line; /about matches no route at all." },
  { el: <HostingSlide />, notes: "Run the two terminal commands. Locally Express serves the built React app plus the API. Then explain how this deck went live: build, push, Vercel, DNS." },
  { el: <ThreeSlide />, id: "three", notes: "Change the shape, colour, wireframe and speed. Lines 7 to 9 of the code update. Point out that this is real WebGL running inside a React component." },
  { el: <LibrariesSlide />, notes: "Click two or three that interest you: D3 for data, GSAP for animation, Matter.js for physics. Frameworks give structure; libraries do one job well." },
  { el: <MetaSlide />, notes: "Reveal: the whole deck is a React app built with Vite and hosted as static files. The slide counter is read live. Run the deploy commands." },
  { el: <QuizSlide />, notes: "Ask the class to answer out loud before you click. Four questions, about 90 seconds." },
  { el: <ThanksSlide />, notes: "Thank everyone, give the domain, and take questions. The buttons jump back to the React history or the 3D demo if someone asks." },
];

export default function App() {
  return <DeckShell slides={SLIDES} />;
}
