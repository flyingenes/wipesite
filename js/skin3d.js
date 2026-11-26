import * as THREE from '../vendor/three.module.min.js';

/**
 * UV helper for standard 64x64 Minecraft skin texture sheets.
 * Maps a single box face (x, y, w, h in pixel coords from top-left) onto BoxGeometry UVs.
 */
function applyBoxUVs(geometry, u, v, w, h, d, texW = 64, texH = 64) {
  // BoxGeometry face order: +x (right), -x (left), +y (top), -y (bottom), +z (front), -z (back)
  const faces = [
    [u, v + d, d, h],                 // +x (character's left side / viewer right)
    [u + d + w, v + d, d, h],         // -x (character's right side / viewer left)
    [u + d, v, w, d],                 // +y (top)
    [u + d + w, v, w, d],             // -y (bottom)
    [u + d, v + d, w, h],             // +z (front)
    [u + d + w + d, v + d, w, h],     // -z (back)
  ];

  const uvAttr = geometry.attributes.uv;
  for (let f = 0; f < 6; f++) {
    const [fx, fy, fw, fh] = faces[f];
    const u0 = fx / texW;
    const u1 = (fx + fw) / texW;
    const v1 = 1 - fy / texH;
    const v0 = 1 - (fy + fh) / texH;

    const base = f * 4;
    if (f === 3) {
      // Flip bottom face vertically to align cleanly
      uvAttr.setXY(base + 0, u0, v0);
      uvAttr.setXY(base + 1, u1, v0);
      uvAttr.setXY(base + 2, u0, v1);
      uvAttr.setXY(base + 3, u1, v1);
    } else {
      uvAttr.setXY(base + 0, u0, v1);
      uvAttr.setXY(base + 1, u1, v1);
      uvAttr.setXY(base + 2, u0, v0);
      uvAttr.setXY(base + 3, u1, v0);
    }
  }
  uvAttr.needsUpdate = true;
}

/**
 * Generates crisp procedural 64x64 Minecraft skins for presets beyond steve.png & alex.png
 * (e.g., WIPE Cobalt / Obsidian Ely.by showcase skins).
 */
function createProceduralSkinTexture(variant) {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const palettes = {
    cobalt: {
      skin: '#e0b89e',
      skinShade: '#c99c80',
      hair: '#111520',
      hairHi: '#243456',
      eyes: '#5c85ff',
      jacket: '#0e121a',
      jacketAccent: '#2f62ff',
      shirt: '#eceef4',
      pants: '#151924',
      boots: '#0a0c12',
    },
    obsidian: {
      skin: '#d9b195',
      skinShade: '#bd9275',
      hair: '#0c0f16',
      hairHi: '#1f2b44',
      eyes: '#2f62ff',
      jacket: '#0b0e14',
      jacketAccent: '#5c85ff',
      shirt: '#dfe6f0',
      pants: '#11151e',
      boots: '#080a0e',
    },
  };

  const p = palettes[variant] || palettes.cobalt;
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  // Head base (8x8x8 at 0,0)
  rect(0, 0, 32, 16, p.skin);
  // Hair top/back/sides
  rect(8, 0, 8, 8, p.hair);
  rect(24, 8, 8, 8, p.hair);
  rect(0, 8, 8, 4, p.hair);
  rect(16, 8, 8, 4, p.hair);
  rect(8, 8, 8, 2, p.hair);
  rect(9, 10, 2, 1, p.hairHi);
  rect(13, 10, 2, 1, p.hairHi);
  // Eyes & shading
  rect(9, 12, 2, 1, '#f4f4f6');
  rect(10, 12, 1, 1, p.eyes);
  rect(13, 12, 2, 1, '#f4f4f6');
  rect(13, 12, 1, 1, p.eyes);
  rect(11, 14, 2, 1, p.skinShade);

  // Torso (8x12x4 at 16,16)
  rect(16, 16, 24, 16, p.jacket);
  rect(22, 20, 4, 12, p.shirt);
  rect(23, 21, 2, 8, p.jacketAccent);
  rect(32, 22, 8, 3, p.jacketAccent); // back stripe

  // Arms (right 40,16 & left 32,48)
  rect(40, 16, 16, 16, p.jacket);
  rect(40, 29, 16, 3, p.skin);
  rect(44, 25, 4, 2, p.jacketAccent);

  rect(32, 48, 16, 16, p.jacket);
  rect(32, 61, 16, 3, p.skin);
  rect(36, 57, 4, 2, p.jacketAccent);

  // Legs (right 0,16 & left 16,48)
  rect(0, 16, 16, 16, p.pants);
  rect(0, 28, 16, 4, p.boots);
  rect(4, 28, 4, 1, p.jacketAccent);

  rect(16, 48, 16, 16, p.pants);
  rect(16, 60, 16, 4, p.boots);
  rect(20, 60, 4, 1, p.jacketAccent);

  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates crisp pixel-art Ely.by / WIPE cape texture.
 */
function createCapeTexture(accentHex = '#2f62ff') {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 48;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#111114';
  ctx.fillRect(0, 0, 32, 48);
  ctx.fillStyle = accentHex;
  ctx.fillRect(2, 2, 28, 44);
  ctx.fillStyle = '#0e0e11';
  ctx.fillRect(5, 5, 22, 38);
  // Crisp geometric W emblem
  ctx.fillStyle = '#f2f2f4';
  ctx.fillRect(8, 14, 3, 18);
  ctx.fillRect(21, 14, 3, 18);
  ctx.fillRect(14, 21, 4, 11);
  ctx.fillRect(11, 28, 3, 4);
  ctx.fillRect(18, 28, 3, 4);

  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Mounts an interactive Three.js 3D Minecraft character inside a skin3d-slide container.
 */
export function mountSkinViewer(container, options = {}) {
  const wrap = container.querySelector('.skin3d-canvas-wrap');
  if (!wrap) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const initW = wrap.clientWidth || 380;
  const initH = wrap.clientHeight || 340;
  renderer.setSize(initW, initH);
  wrap.innerHTML = '';
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.1, 100);
  camera.position.set(0, 0.2, 5.4);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(3.5, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.AmbientLight(0xd4d8e2, 0.72);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x2f62ff, 8.5, 14);
  rimLight.position.set(-2.6, 1.4, -2.2);
  scene.add(rimLight);

  const playerRoot = new THREE.Group();
  scene.add(playerRoot);

  // Subtle floor ring shadow under feet
  const shadowGeo = new THREE.CircleGeometry(0.85, 32);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.42,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.58;
  scene.add(shadow);

  // Load texture (real png from rattest or procedural skin)
  let skinTex;
  if (options.skinPath) {
    const loader = new THREE.TextureLoader();
    skinTex = loader.load(options.skinPath);
    skinTex.magFilter = THREE.NearestFilter;
    skinTex.minFilter = THREE.NearestFilter;
    skinTex.colorSpace = THREE.SRGBColorSpace;
  } else {
    skinTex = createProceduralSkinTexture(options.procedural || 'cobalt');
  }

  const mat = new THREE.MeshStandardMaterial({
    map: skinTex,
    roughness: 0.78,
    metalness: 0.05,
  });

  const overlayMat = new THREE.MeshStandardMaterial({
    map: skinTex,
    transparent: true,
    alphaTest: 0.5,
    roughness: 0.75,
    metalness: 0.05,
  });

  const S = 0.095; // 1 Minecraft pixel = 0.095 world units

  // Head
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 10 * S, 0);
  const headGeo = new THREE.BoxGeometry(8 * S, 8 * S, 8 * S);
  applyBoxUVs(headGeo, 0, 0, 8, 8, 8);
  const headMesh = new THREE.Mesh(headGeo, mat);
  headMesh.position.y = 4 * S;
  headPivot.add(headMesh);

  // Hat outer layer
  const hatGeo = new THREE.BoxGeometry(8.6 * S, 8.6 * S, 8.6 * S);
  applyBoxUVs(hatGeo, 32, 0, 8, 8, 8);
  const hatMesh = new THREE.Mesh(hatGeo, overlayMat);
  hatMesh.position.y = 4 * S;
  headPivot.add(hatMesh);
  playerRoot.add(headPivot);

  // Torso
  const torsoGeo = new THREE.BoxGeometry(8 * S, 12 * S, 4 * S);
  applyBoxUVs(torsoGeo, 16, 16, 8, 12, 4);
  const torsoMesh = new THREE.Mesh(torsoGeo, mat);
  torsoMesh.position.set(0, 4 * S, 0);
  playerRoot.add(torsoMesh);

  // Legs
  const rLegPivot = new THREE.Group();
  rLegPivot.position.set(-2 * S, -2 * S, 0);
  const rLegGeo = new THREE.BoxGeometry(4 * S, 12 * S, 4 * S);
  applyBoxUVs(rLegGeo, 0, 16, 4, 12, 4);
  const rLeg = new THREE.Mesh(rLegGeo, mat);
  rLeg.position.y = -6 * S;
  rLegPivot.add(rLeg);
  playerRoot.add(rLegPivot);

  const lLegPivot = new THREE.Group();
  lLegPivot.position.set(2 * S, -2 * S, 0);
  const lLegGeo = new THREE.BoxGeometry(4 * S, 12 * S, 4 * S);
  applyBoxUVs(lLegGeo, 16, 48, 4, 12, 4);
  const lLeg = new THREE.Mesh(lLegGeo, mat);
  lLeg.position.y = -6 * S;
  lLegPivot.add(lLeg);
  playerRoot.add(lLegPivot);

  // Arms (rebuildable for Classic 4px vs Slim 3px)
  const rArmPivot = new THREE.Group();
  const lArmPivot = new THREE.Group();
  playerRoot.add(rArmPivot, lArmPivot);

  let isSlim = Boolean(options.slim);

  function buildArms() {
    rArmPivot.clear();
    lArmPivot.clear();
    const aw = isSlim ? 3 : 4;
    const offsetX = (4 + aw / 2) * S;

    rArmPivot.position.set(-offsetX, 9 * S, 0);
    const rArmGeo = new THREE.BoxGeometry(aw * S, 12 * S, 4 * S);
    applyBoxUVs(rArmGeo, 40, 16, aw, 12, 4);
    const rArm = new THREE.Mesh(rArmGeo, mat);
    rArm.position.y = -5 * S;
    rArmPivot.add(rArm);

    lArmPivot.position.set(offsetX, 9 * S, 0);
    const lArmGeo = new THREE.BoxGeometry(aw * S, 12 * S, 4 * S);
    applyBoxUVs(lArmGeo, 32, 48, aw, 12, 4);
    const lArm = new THREE.Mesh(lArmGeo, mat);
    lArm.position.y = -5 * S;
    lArmPivot.add(lArm);
  }
  buildArms();

  // Animated Ely.by Cape
  const capePivot = new THREE.Group();
  capePivot.position.set(0, 9.6 * S, -2.15 * S);
  const capeGeo = new THREE.BoxGeometry(10 * S, 16 * S, 0.8 * S);
  const capeMat = new THREE.MeshStandardMaterial({
    map: createCapeTexture(options.capeColor || '#2f62ff'),
    roughness: 0.72,
    metalness: 0.08,
  });
  const capeMesh = new THREE.Mesh(capeGeo, capeMat);
  capeMesh.position.set(0, -8 * S, -0.4 * S);
  capePivot.add(capeMesh);
  capePivot.visible = options.cape !== false;
  playerRoot.add(capePivot);

  // Orbit interaction (stops propagation so dragging the 3D skin doesn't drag the carousel!)
  let targetRotY = options.initialYaw ?? -0.42;
  let currentRotY = targetRotY;
  let targetRotX = 0.08;
  let currentRotX = targetRotX;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  wrap.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    wrap.setPointerCapture(e.pointerId);
  });

  wrap.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    e.stopPropagation();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    targetRotY += dx * 0.013;
    targetRotX = Math.max(-0.5, Math.min(0.55, targetRotX + dy * 0.009));
  });

  const endDrag = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    dragging = false;
  };
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);

  // Wire slide UI controls (Classic/Slim, Cape, Flip)
  const btnModel = container.querySelector('[data-skin-model]');
  const btnCape = container.querySelector('[data-skin-cape]');
  const btnFlip = container.querySelector('[data-skin-flip]');

  if (btnModel) {
    btnModel.addEventListener('click', (e) => {
      e.stopPropagation();
      isSlim = !isSlim;
      buildArms();
      btnModel.textContent = isSlim ? 'Slim 3px' : 'Classic 4px';
      btnModel.classList.toggle('is-active', isSlim);
    });
  }

  if (btnCape) {
    btnCape.addEventListener('click', (e) => {
      e.stopPropagation();
      capePivot.visible = !capePivot.visible;
      btnCape.classList.toggle('is-active', capePivot.visible);
    });
  }

  if (btnFlip) {
    btnFlip.addEventListener('click', (e) => {
      e.stopPropagation();
      targetRotY += Math.PI;
    });
  }

  const ro = new ResizeObserver(() => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w > 10 && h > 10) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  ro.observe(wrap);

  let disposed = false;
  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;
    requestAnimationFrame(animate);
    if (document.hidden) return;

    const t = clock.getElapsedTime();
    if (!dragging) {
      targetRotY += 0.0045;
    }

    currentRotY += (targetRotY - currentRotY) * 0.1;
    currentRotX += (targetRotX - currentRotX) * 0.1;

    playerRoot.rotation.y = currentRotY;
    playerRoot.rotation.x = currentRotX;
    playerRoot.position.y = Math.sin(t * 2.1) * 0.035;

    // Subtle idle walk & breathing animation
    const sway = Math.sin(t * 2.2) * 0.14;
    rArmPivot.rotation.x = sway;
    lArmPivot.rotation.x = -sway;
    rArmPivot.rotation.z = -0.04 - Math.sin(t * 1.4) * 0.025;
    lArmPivot.rotation.z = 0.04 + Math.sin(t * 1.4) * 0.025;

    rLegPivot.rotation.x = -sway * 0.7;
    lLegPivot.rotation.x = sway * 0.7;

    headPivot.rotation.y = Math.sin(t * 0.9) * 0.12;
    capePivot.rotation.x = 0.18 + Math.sin(t * 2.5) * 0.07;

    renderer.render(scene, camera);
  }
  animate();

  return {
    dispose() {
      disposed = true;
      ro.disconnect();
      renderer.dispose();
    },
  };
}
