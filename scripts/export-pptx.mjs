// Exports the deck to a static PowerPoint: one full-slide image per slide,
// with each slide's notes copied into the PowerPoint speaker notes.
//
//   npm run export:pptx
//
// First time only: npx playwright install chromium
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import PptxGenJS from "pptxgenjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "Building-the-Modern-Web.pptx");
const PORT = 4173;
const W = 1280, H = 720, SCALE = 2; // 2560x1440 images, sharp on a projector

// Run Vite's own CLI with this Node (works the same on Windows, macOS and Linux)
const VITE = path.join(root, "node_modules", "vite", "bin", "vite.js");

function build() {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [VITE, "build"], { cwd: root, stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("vite build failed"))));
  });
}

function startPreview() {
  const p = spawn(process.execPath, [VITE, "preview", "--port", String(PORT), "--strictPort"], { cwd: root });
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("vite preview did not start")), 30000);
    p.stdout.on("data", (d) => { if (String(d).includes(String(PORT))) { clearTimeout(t); resolve(p); } });
    p.on("exit", (c) => { clearTimeout(t); reject(new Error(`vite preview exited (${c}). Is port ${PORT} already in use?`)); });
  });
}

await build();
const server = await startPreview();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  page.on("pageerror", (e) => console.warn("page error:", e.message));
  // ?export hides the on-screen arrows and N button
  await page.goto(`http://localhost:${PORT}/?export#1`, { waitUntil: "networkidle" });
  const total = await page.evaluate(() => Number(document.querySelector("[data-count]").dataset.count));

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = "Building the Modern Web";
  for (let k = 1; k <= total; k++) {
    await page.waitForTimeout(700); // let animations, fonts and the 3D scene settle
    const image = await page.screenshot({ type: "png" });
    const notes = await page.evaluate(() => document.querySelector("[data-notes]").dataset.notes);
    const slide = pptx.addSlide();
    slide.addImage({ data: "image/png;base64," + image.toString("base64"), x: 0, y: 0, w: 10, h: 5.625 });
    if (notes) slide.addNotes(notes);
    console.log(`slide ${k}/${total}`);
    await page.keyboard.press("ArrowRight");
  }
  await pptx.writeFile({ fileName: OUT });
  console.log(`\nSaved ${OUT}`);
} finally {
  await browser.close();
  server.kill();
}
process.exit(0);
