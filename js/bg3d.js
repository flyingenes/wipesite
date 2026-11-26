import * as THREE from '../vendor/three.module.min.js';

/**
 * Subtle obsidian 3D ambient WebGL background.
 * Keeps #0a0a0a dominance intact while adding mouse + scroll depth parallax.
 */
export function initBg3D() {
  const canvas = document.getElementById('bg-3d-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.045);

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 18);

  // Subtle lighting tuned to the obsidian + #2f62ff cobalt blue palette
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  const blueLight = new THREE.PointLight(0x2f62ff, 26, 44);
  blueLight.position.set(6, 5, 10);
  scene.add(blueLight);

  const rimLight = new THREE.PointLight(0x85a6ff, 10, 46);
  rimLight.position.set(-10, -4, 9);
  scene.add(rimLight);

  // Floating subtle voxel wireframes & matte obsidian blocks
  const group = new THREE.Group();
  scene.add(group);

  const solidMat = new THREE.MeshStandardMaterial({
    color: 0x0e1118,
    roughness: 0.55,
    metalness: 0.45,
  });

  const wireMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.055,
  });

  const blueWireMat = new THREE.LineBasicMaterial({
    color: 0x2f62ff,
    transparent: true,
    opacity: 0.22,
  });

  const blocks = [];
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const edgesGeo = new THREE.EdgesGeometry(cubeGeo);

  const seeds = [
    [-11.5, 5.2, -5.5, 1.5, true],
    [11.2, 4.6, -4.8, 1.35, false],
    [-9.8, -4.6, -7.2, 1.75, false],
    [10.4, -3.8, -6.5, 1.6, true],
    [-14.2, 0.4, -9.5, 2.2, false],
    [14.0, 0.2, -9.0, 2.0, false],
    [-5.8, 7.6, -11.5, 1.3, false],
    [6.4, 7.2, -10.8, 1.25, true],
    [-6.2, -7.4, -10.0, 1.4, true],
    [6.8, -7.2, -11.2, 1.5, false],
    [0.2, 9.2, -14.5, 1.9, false],
    [-16.5, 6.2, -13.5, 2.4, false],
    [16.2, -6.0, -13.0, 2.3, false],
  ];

  seeds.forEach(([x, y, z, s, isAccent], i) => {
    const holder = new THREE.Group();
    const mesh = new THREE.Mesh(cubeGeo, solidMat);
    const wire = new THREE.LineSegments(edgesGeo, isAccent ? blueWireMat : wireMat);
    wire.scale.setScalar(1.015);
    holder.add(mesh, wire);
    holder.position.set(x, y, z);
    holder.scale.setScalar(s);
    holder.rotation.set(i * 0.6, i * 0.9, i * 0.3);
    group.add(holder);
    blocks.push({
      holder,
      baseY: y,
      speedX: (i % 2 === 0 ? 1 : -1) * (0.0012 + (i % 4) * 0.0004),
      speedY: (i % 3 === 0 ? -1 : 1) * (0.0018 + (i % 5) * 0.00035),
      phase: i * 1.17,
    });
  });

  // Distant perspective floor grid (ultra low opacity)
  const grid = new THREE.GridHelper(64, 32, 0x16295c, 0x14161c);
  grid.position.set(0, -11.5, -14);
  grid.rotation.x = 0.08;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);

  // Subtle floating dust vertices
  const dustCount = 110;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 38;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
    dustPos[i * 3 + 2] = -4 - Math.random() * 20;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xaaaab0,
    size: 0.055,
    transparent: true,
    opacity: 0.32,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let scrollNorm = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollNorm = window.scrollY / maxScroll;
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    if (document.hidden) return;

    const t = clock.getElapsedTime();
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;

    camera.position.x = curX * 1.15;
    camera.position.y = 0.6 - curY * 0.75 - scrollNorm * 2.2;
    camera.lookAt(0, -scrollNorm * 1.2, -6);

    blueLight.position.x = 6 + Math.sin(t * 0.35) * 4 + curX * 2;
    blueLight.position.y = 4 + Math.cos(t * 0.28) * 2.5 - curY * 2;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      b.holder.rotation.x += b.speedX;
      b.holder.rotation.y += b.speedY;
      b.holder.position.y = b.baseY + Math.sin(t * 0.55 + b.phase) * 0.28;
    }

    dust.rotation.y = t * 0.015;
    renderer.render(scene, camera);
  }

  tick();
}
