import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// The wave is animated in the vertex shader (GPU), so the CPU does almost nothing per frame.
const VERT = `
uniform float uTime; uniform float uSize; uniform float uScale;
attribute vec3 aColor; varying vec3 vColor;
void main() {
  vec3 p = position;
  p.y = sin(p.x * 0.32 + uTime * 0.9) * 0.7 + cos(p.z * 0.38 + uTime * 0.7) * 0.7 + sin((p.x + p.z) * 0.18 + uTime * 0.5) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = max(uSize * uScale / -mv.z, 1.5);
  gl_Position = projectionMatrix * mv;
  vColor = aColor;
}`;
const FRAG = `
uniform float uOpacity; varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * uOpacity);
}`;

export default function ThreeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: ref.current, alpha: true, antialias: false, powerPreference: 'low-power' }); } catch { return undefined; }
    const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 700;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

    const cols = coarse ? 45 : 90, rows = coarse ? 32 : 62, step = coarse ? 0.75 : 0.55, N = cols * rows;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x7c5cff), c2 = new THREE.Color(0x00e0c6), c3 = new THREE.Color(0xff5ca8);
    for (let i = 0; i < cols; i++) {
      const t = i / cols, cc = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2);
      for (let j = 0; j < rows; j++) {
        const k = (i * rows + j) * 3;
        pos[k] = (i - cols / 2) * step; pos[k + 2] = (j - rows / 2) * step - 6;
        col[k] = cc.r; col[k + 1] = cc.g; col[k + 2] = cc.b;
      }
    }
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    waveGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    const uniforms = { uTime: { value: 0 }, uSize: { value: 0.075 }, uScale: { value: 800 }, uOpacity: { value: 0.7 } };
    const waveMat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const wave = new THREE.Points(waveGeo, waveMat); wave.position.y = -5; wave.frustumCulled = false; scene.add(wave);

    const count = coarse ? 300 : 900, sp = new Float32Array(count);
    for (let i = 0; i < count; i++) sp[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 30 : 90);
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.06, color: 0xb9b0ff, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat); stars.position.y = 6; scene.add(stars);

    const shardGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const shards = [[-11, 4, -10, 0x7c5cff], [12, 7, -14, 0x00e0c6], [9, -1, -6, 0xff5ca8]].map(([x, y, z, c]) => {
      const m = new THREE.Mesh(shardGeo, new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: 0.45 }));
      m.position.set(x, y, z); scene.add(m); return m;
    });

    // On phones the address bar changes innerHeight while scrolling. Ignore height-only resizes so the canvas never re-allocates.
    let lastW = 0;
    const resize = () => {
      const w = innerWidth, h = innerHeight;
      if (coarse && w === lastW) return;
      lastW = w;
      const pr = Math.min(devicePixelRatio, coarse ? 1.25 : 1.5);
      renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      uniforms.uScale.value = (h * pr) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    };
    let mx = 0, my = 0, sy = 0, wasLight = null, frame = 0, raf;
    const onMove = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const onScroll = () => { sy = scrollY; };
    resize();
    addEventListener('resize', resize); addEventListener('mousemove', onMove, { passive: true }); addEventListener('scroll', onScroll, { passive: true });
    const isLight = () => (document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches);

    const loop = (ms) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (reduce && frame > 0) return;
      if (coarse && (frame++ & 1)) return; // 30fps on phones
      if (!coarse) frame++;
      const t = ms / 1000, light = isLight();
      if (light !== wasLight) {
        wasLight = light;
        waveMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        uniforms.uOpacity.value = light ? 0.55 : 0.7; waveMat.needsUpdate = true;
      }
      uniforms.uTime.value = t;
      wave.rotation.y = mx * 0.25; stars.rotation.y = t * 0.01 + mx * 0.1;
      shards.forEach((s, i) => { s.rotation.x = t * 0.1 * (i + 1); s.rotation.y = t * 0.25; });
      camera.position.set(mx * 2, 4 - my * 1.5 - sy * 0.0015, 14); camera.lookAt(0, 0, -2);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize); removeEventListener('mousemove', onMove); removeEventListener('scroll', onScroll);
      [waveGeo, starGeo, shardGeo].forEach((g) => g.dispose());
      [waveMat, starMat, ...shards.map((s) => s.material)].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas id="bg" ref={ref} />;
}