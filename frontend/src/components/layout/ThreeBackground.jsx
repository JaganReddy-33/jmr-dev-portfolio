import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Flowing particle-wave terrain, stars and wire shards. Reacts to mouse, scroll and light/dark theme. */
export default function ThreeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: ref.current, alpha: true, antialias: true }); } catch { return undefined; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    const small = innerWidth < 700, cols = small ? 55 : 100, rows = small ? 40 : 70, N = cols * rows;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x7c5cff), c2 = new THREE.Color(0x00e0c6), c3 = new THREE.Color(0xff5ca8);
    for (let i = 0; i < cols; i++) {
      const t = i / cols, cc = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2);
      for (let j = 0; j < rows; j++) {
        const k = (i * rows + j) * 3;
        pos[k] = (i - cols / 2) * 0.55; pos[k + 2] = (j - rows / 2) * 0.55 - 6;
        col[k] = cc.r; col[k + 1] = cc.g; col[k + 2] = cc.b;
      }
    }
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const waveMat = new THREE.PointsMaterial({ size: 0.075, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
    const wave = new THREE.Points(waveGeo, waveMat); wave.position.y = -5; scene.add(wave);

    const sp = new Float32Array(900);
    for (let i = 0; i < 900; i++) sp[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 30 : 90);
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.06, color: 0xb9b0ff, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat); stars.position.y = 6; scene.add(stars);

    const shardGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const shards = [[-11, 4, -10, 0x7c5cff], [12, 7, -14, 0x00e0c6], [9, -1, -6, 0xff5ca8]].map(([x, y, z, c]) => {
      const m = new THREE.Mesh(shardGeo, new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: 0.45 }));
      m.position.set(x, y, z); scene.add(m); return m;
    });

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    };
    let mx = 0, my = 0, sy = 0, wasLight = false, raf;
    const onMove = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const onScroll = () => { sy = scrollY; };
    resize(); addEventListener('resize', resize); addEventListener('mousemove', onMove); addEventListener('scroll', onScroll);
    const isLight = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches;

    const loop = (ms) => {
      const t = ms / 1000, light = isLight();
      if (light !== wasLight) { wasLight = light; waveMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending; waveMat.opacity = light ? 0.55 : 0.7; waveMat.needsUpdate = true; }
      const p = waveGeo.attributes.position.array;
      for (let k = 0; k < p.length; k += 3) {
        const x = p[k], z = p[k + 2];
        p[k + 1] = Math.sin(x * 0.32 + t * 0.9) * 0.7 + Math.cos(z * 0.38 + t * 0.7) * 0.7 + Math.sin((x + z) * 0.18 + t * 0.5) * 0.6;
      }
      waveGeo.attributes.position.needsUpdate = true;
      wave.rotation.y = mx * 0.25; stars.rotation.y = t * 0.01 + mx * 0.1;
      shards.forEach((s, i) => { s.rotation.x = t * 0.1 * (i + 1); s.rotation.y = t * 0.25; });
      camera.position.set(mx * 2, 4 - my * 1.5 - sy * 0.0015, 14); camera.lookAt(0, 0, -2);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
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
