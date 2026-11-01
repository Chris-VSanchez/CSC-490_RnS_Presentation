import { useState, useEffect, useRef } from "react";
import { T, Slide, Split, Col, Code, Tabs } from "../ui.jsx";

const SHAPES = {
  "Torus knot": { make: (THREE) => new THREE.TorusKnotGeometry(0.8, 0.28, 160, 20), code: "TorusKnotGeometry(0.8, 0.28, 160, 20)" },
  Cube: { make: (THREE) => new THREE.BoxGeometry(1.5, 1.5, 1.5), code: "BoxGeometry(1.5, 1.5, 1.5)" },
  Sphere: { make: (THREE) => new THREE.SphereGeometry(1.1, 48, 32), code: "SphereGeometry(1.1, 48, 32)" },
  Gem: { make: (THREE) => new THREE.IcosahedronGeometry(1.2, 0), code: "IcosahedronGeometry(1.2, 0)" },
};
const COLORS = ["#2563eb", "#0f766e", "#b45309", "#7952b3", "#e11d48"];

/**
 * A Three.js scene inside a React component.
 * React owns the <canvas>; Three.js draws into it.
 * useEffect sets the scene up once and tears it down when you leave the slide.
 */
function Scene({ shape, color, wireframe, speed }) {
  const canvasRef = useRef(null);
  const three = useRef(null);      // { THREE, renderer, mesh } once loaded
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const [ready, setReady] = useState(false);

  // 1. Set up once. three is loaded only when this slide is shown (dynamic import).
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 4.2;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.15 }));
      const light = new THREE.DirectionalLight("white", 3);
      light.position.set(3, 4, 5);
      scene.add(mesh, light, new THREE.AmbientLight("white", 0.6));
      renderer.setAnimationLoop(() => {
        mesh.rotation.y += 0.01 * speedRef.current;
        mesh.rotation.x += 0.004 * speedRef.current;
        renderer.render(scene, camera);
      });
      three.current = { THREE, renderer, mesh };
      setReady(true);
      cleanup = () => {
        renderer.setAnimationLoop(null);
        mesh.geometry.dispose();
        mesh.material.dispose();
        renderer.dispose();
      };
    });
    return () => { cancelled = true; cleanup(); three.current = null; };
  }, []);

  // 2. When props change, update the existing mesh instead of rebuilding the scene
  useEffect(() => {
    if (!ready || !three.current) return;
    const { THREE, mesh } = three.current;
    mesh.geometry.dispose();
    mesh.geometry = SHAPES[shape].make(THREE);
  }, [shape, ready]);

  useEffect(() => {
    if (!ready || !three.current) return;
    const { mesh } = three.current;
    mesh.material.color.set(color);
    mesh.material.wireframe = wireframe;
  }, [color, wireframe, ready]);

  return (
    <div style={{ position: "relative", height: "100%", borderRadius: 14, overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #1e293b, #0b0f14 75%)" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {!ready && <div className="note" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#94a3b8" }}>Loading three.js…</div>}
      <div className="mono" style={{ position: "absolute", left: 12, bottom: 10, fontSize: 12, color: "#94a3b8" }}>WebGL · rendered live at ~60 fps</div>
    </div>
  );
}

export function ThreeSlide() {
  const [shape, setShape] = useState("Torus knot");
  const [color, setColor] = useState(COLORS[0]);
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1);
  const code = `import * as THREE from "three"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, w / h)
const renderer = new THREE.WebGLRenderer({ canvas })

const geometry = new THREE.${SHAPES[shape].code}
const material = new THREE.MeshStandardMaterial({
  color: "${color}", wireframe: ${wireframe},
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh, new THREE.DirectionalLight("white", 3))

renderer.setAnimationLoop(() => {
  mesh.rotation.y += ${(0.01 * speed).toFixed(3)}
  renderer.render(scene, camera)
})`;
  return (
    <Slide kicker="Niche libraries" title="Three.js: 3D graphics in the browser">
      <Split cols="1fr 1.1fr">
        <Col gap={12}>
          <div style={{ height: 360 }}><Scene shape={shape} color={color} wireframe={wireframe} speed={speed} /></div>
          <Tabs options={Object.keys(SHAPES)} value={shape} onChange={setShape} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {COLORS.map((c) => (
                <button key={c} aria-label={`color ${c}`} onClick={() => setColor(c)}
                  style={{ width: 26, height: 26, borderRadius: 13, background: c, cursor: "pointer", border: c === color ? `3px solid ${T.ink}` : "3px solid #fff", boxShadow: "0 0 0 1px #d6dae0" }} />
              ))}
            </div>
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> wireframe
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14 }}>
              speed <input type="range" min="0" max="4" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </label>
          </div>
        </Col>
        <Col gap={12}>
          <Code file="scene.js" size={12.5} hl={[7, 8, 9]}>{code}</Code>
          <div className="callout info" style={{ fontSize: 15 }}><div className="h">A friendly layer over WebGL</div>
            Started by Ricardo Cabello (“mrdoob”) in 2010. Raw WebGL needs hundreds of lines for one lit, spinning shape. Used for product viewers, games and portfolio sites; React developers often use React Three Fiber.
          </div>
        </Col>
      </Split>
    </Slide>
  );
}
