# Building the Modern Web: CSC 490 Solo R&S Presentation

An interactive slide deck about web development frameworks, with an emphasis on React. Bootstrap, Express and Three.js each get a section. Every slide is a live React component, and the deck is the final demo: it's a React app built with Vite and hosted as static files.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173), then press F11 for full screen.

## Presenting

| Key | Action |
|---|---|
| → / Space / Page Down | Next slide |
| ← / Page Up | Previous slide |
| Home / End | First / last slide |
| N | Toggle speaker notes |
| Click a progress-bar segment | Jump to that slide |

The URL keeps your place (`#7` = slide 7), so refreshing doesn't send you back to the start.

## Slides (about 18 minutes)

| # | Slide | Live demo |
|---|---|---|
| 1 | Building the Modern Web | Type a name, React re-renders the greeting |
| 2 | Roadmap | Cards jump to each section |
| 3 | Why frameworks exist | Vanilla JS vs React, working like button |
| 4 | The landscape | Same counter in React, Vue, Angular, Svelte |
| 5 | React history, 2011 to 2026 | Clickable timeline |
| 6 | Components and props | Edit props, card and code update together |
| 7 | The virtual DOM | Add / rename / reverse a keyed list, see the DOM operations |
| 8 | Hooks | Stopwatch with useState + useEffect, code highlights as it runs |
| 9 | React today | Platforms, plus meta-frameworks table |
| 10 | Bootstrap | Toggle classes on real Bootstrap 5 CSS in a live preview |
| 11 | Express | Send requests to a simulated server, matching lines highlight |
| 12 | Hosting | Local Express vs static host + domain |
| 13 | Three.js | Real WebGL scene: shape, colour, wireframe, speed |
| 14 | Niche libraries | D3, GSAP, Chart.js, Matter.js, Howler, Leaflet |
| 15 | This deck is a React app | Live slide counter, deploy steps |
| 16 | Quiz | Four questions with instant feedback |
| 17 | Thank you + sources | Links to every source |

## Where things live

```
src/
  config.js           ← your domain and name (edit this first)
  App.jsx             ← slide order + speaker notes
  ui.jsx              ← the deck kit: DeckShell, Slide, Split, Col, Code, Tabs, Reveal, Term, Tiers, Checklist, Quiz
  index.css           ← colours and shared classes
  slides/
    Intro.jsx         ← slides 1–4
    React.jsx         ← slides 5–9
    Bootstrap.jsx     ← slide 10
    Express.jsx       ← slides 11–12
    Three.jsx         ← slide 13
    Closing.jsx       ← slides 14–17
scripts/export-pptx.mjs  ← makes the static PowerPoint
```

- **Change the domain or your name:** `src/config.js`.
- **Reorder, remove or add a slide:** edit the `SLIDES` list in `src/App.jsx`.
- **Change what you say:** the `notes` on each slide in `src/App.jsx`. Press N to see them.

## Put it on a real domain (Vercel)

1. Push this folder to its own GitHub repository.
2. Go to vercel.com, sign in with GitHub, choose **Add New → Project**, and import the repository. It detects Vite automatically (build command `npm run build`, output `dist`). Click **Deploy**.
3. You get a free `something.vercel.app` address straight away.
4. For your own domain: in the project, open **Settings → Domains**, add your domain, and create the DNS records Vercel shows you at your registrar. HTTPS is set up automatically.
5. Put the final domain in `src/config.js` and push. Vercel redeploys on every push.

Netlify and Cloudflare Pages work the same way (build `npm run build`, publish `dist`). No server is needed: the deck is plain HTML, CSS and JavaScript once built.

## Make the static PowerPoint

```bash
npx playwright install chromium
```

```bash
npm run export:pptx
```

The first command is needed only once. The second builds the deck, opens each slide in a headless browser, and saves `Building-the-Modern-Web.pptx`. Each slide becomes a full-size image, and the speaker notes are copied into PowerPoint's notes. Interactive slides are captured in their starting state.
