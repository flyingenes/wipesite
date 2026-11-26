import { mountSkinViewer } from './skin3d.js';

/**
 * Interactive 3-panel depth carousel faithfully reproducing isaeva.xyz's
 * --Distance / --Depth / --Stretch / --Pull physics + 3D perspective mouse tilt,
 * upgraded with fluid directional tab choreography and smooth 3D orbital stepping.
 */
export function initCarousel() {
  const preview = document.getElementById('HomepageGallery');
  const gallery = document.getElementById('HeroGallery');
  const tabsWrap = document.getElementById('HeroGalleryTabs');
  const captionEl = document.getElementById('HeroSlideCaption');
  const btnPrev = document.getElementById('HeroPrevBtn');
  const btnNext = document.getElementById('HeroNextBtn');

  if (!preview || !gallery || !tabsWrap) return null;

  const TAB_ORDER = ['interface', 'modrinth', 'skins'];

  const DECKS = {
    interface: [
      {
        title: 'Home Dashboard',
        sub: 'Full-bleed backdrop, 1-click launch & quick version row',
        src: 'assets/screenshots/01_home.png',
      },
      {
        title: 'Versions Manager',
        sub: 'Isolated Fabric, Forge, NeoForge & Vanilla folders',
        src: 'assets/screenshots/02_versions.png',
      },
      {
        title: 'Java & Memory',
        sub: 'Auto Adoptium Java 8–25, -Xmx RAM slider & JVM flags',
        src: 'assets/screenshots/06_settings_java.png',
      },
      {
        title: 'Live Console',
        sub: 'Real-time stdout/stderr output & crash diagnostics',
        src: 'assets/screenshots/04_console.png',
      },
      {
        title: 'Appearance & Themes',
        sub: 'Deep slate Dark Mode & high-contrast Light Mode',
        src: 'assets/screenshots/08_appearance.png',
      },
      {
        title: 'Account Manager',
        sub: 'Offline RFC 4122 v3 UUID profiles & quick switcher',
        src: 'assets/screenshots/07_accounts.png',
      },
    ],

    modrinth: [
      {
        title: 'Modrinth v2 Browser',
        sub: 'Search & install mods directly into your active profile',
        src: 'assets/screenshots/03_browse.png',
      },
      {
        title: 'Mod Version Picker',
        sub: 'Filter compatible releases & loaders per instance',
        src: 'assets/screenshots/09_moddetail.png',
      },
      {
        title: 'New Version Creator',
        sub: 'Fabric, Forge, NeoForge, Quilt & Vanilla in one click',
        src: 'assets/screenshots/10_create.png',
      },
      {
        title: 'Light Mode — Browse',
        sub: 'Crisp high-contrast Light UI for Modrinth browsing',
        src: 'assets/screenshots/13_light_browse.png',
      },
      {
        title: 'Light Mode — Settings',
        sub: 'Consistent Light theme across every launcher view',
        src: 'assets/screenshots/14_light_settings.png',
      },
    ],

    skins: [
      {
        title: 'WIPE Cobalt',
        sub: 'Interactive 3D · Drag to orbit · Animated Cape',
        skinConfig: { procedural: 'cobalt', slim: false, cape: true, capeColor: '#2f62ff', initialYaw: -0.45 },
      },
      {
        title: 'Steve (Classic 4px)',
        sub: 'Bundled WIPE preset · assets/skins/steve.png',
        skinConfig: { skinPath: 'assets/images/skins/steve.png', slim: false, cape: true, capeColor: '#2f62ff', initialYaw: 0.35 },
      },
      {
        title: 'Alex (Slim 3px)',
        sub: 'Bundled WIPE preset · assets/skins/alex.png',
        skinConfig: { skinPath: 'assets/images/skins/alex.png', slim: true, cape: true, capeColor: '#5c85ff', initialYaw: -0.35 },
      },
      {
        title: 'Ely.by Obsidian',
        sub: 'Custom 64x64 PNG & Ely.by cape preview',
        skinConfig: { procedural: 'obsidian', slim: true, cape: true, capeColor: '#1d47d4', initialYaw: 0.5 },
      },
    ],
  };

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeTab = 'interface';
  let activeIndex = 0;
  let skinViewers = [];
  let tabSwitchToken = 0;
  let tabSwitchTimer = null;
  let stepCleanupTimer = null;

  // Drag physics state
  let isDragging = false;
  let dragStartX = 0;
  let dragDelta = 0;
  let dragPointerId = null;

  function disposeSkinViewers() {
    skinViewers.forEach((v) => v && v.dispose());
    skinViewers = [];
  }

  function wrapIndex(idx, len) {
    return ((idx % len) + len) % len;
  }

  function renderSkinSlideMarkup(item) {
    const slimInit = item.skinConfig.slim;
    const capeInit = item.skinConfig.cape !== false;
    return `
      <div class="skin3d-slide slide-inner">
        <div class="skin3d-head">
          <div>
            <div class="skin3d-title">${item.title}</div>
            <div class="skin3d-sub">${item.sub}</div>
          </div>
          <span class="skin3d-hint">DRAG 3D</span>
        </div>
        <div class="skin3d-canvas-wrap"></div>
        <div class="skin3d-controls">
          <div class="skin3d-btn-group">
            <button type="button" class="skin3d-ctrl-btn ${slimInit ? 'is-active' : ''}" data-skin-model>${slimInit ? 'Slim 3px' : 'Classic 4px'}</button>
            <button type="button" class="skin3d-ctrl-btn ${capeInit ? 'is-active' : ''}" data-skin-cape>Cape</button>
            <button type="button" class="skin3d-ctrl-btn" data-skin-flip>Flip 180°</button>
          </div>
          <span class="skin3d-hint">64×64 PNG</span>
        </div>
      </div>
    `;
  }

  function createSlideElement(item, dist, tabMode) {
    const slide = document.createElement('div');
    slide.className = 'HeroSlide';
    slide.dataset.active = dist === 0 ? 'true' : 'false';
    slide.dataset.offset = String(dist);
    slide.style.setProperty('--Distance', String(dist));
    slide.style.setProperty('--Depth', String(Math.abs(dist)));
    slide.style.setProperty('--Stretch', '0');
    slide.style.setProperty('--Pull', '0');

    if (tabMode === 'skins') {
      slide.innerHTML = renderSkinSlideMarkup(item);
    } else {
      slide.innerHTML = `
        <div class="shot-slide slide-inner">
          <img src="${item.src}" alt="WIPE Launcher — ${item.title}" decoding="async" />
        </div>
      `;
    }

    slide.addEventListener('click', () => {
      const currentOffset = Number(slide.dataset.offset);
      if (currentOffset !== 0) step(currentOffset);
    });

    return slide;
  }

  function updateCaption(animate = false) {
    if (!captionEl) return;
    const items = DECKS[activeTab];
    const cur = items[activeIndex];
    const curNum = String(activeIndex + 1).padStart(2, '0');
    const totalNum = String(items.length).padStart(2, '0');
    const html = `<strong>${cur.title}</strong> — ${cur.sub}<span class="HeroSlideCounter">${curNum}/${totalNum}</span>`;

    if (!animate || prefersReducedMotion()) {
      captionEl.innerHTML = html;
      return;
    }

    captionEl.classList.add('is-swapping');
    setTimeout(() => {
      captionEl.innerHTML = html;
      requestAnimationFrame(() => {
        captionEl.classList.remove('is-swapping');
      });
    }, 130);
  }

  function renderDeck({ spreadFromCenter = false } = {}) {
    clearTimeout(stepCleanupTimer);
    disposeSkinViewers();
    gallery.innerHTML = '';

    const items = DECKS[activeTab];
    const len = items.length;
    preview.dataset.mode = activeTab;

    const offsets = [-1, 0, 1];
    const createdSlides = [];

    offsets.forEach((dist) => {
      const idx = wrapIndex(activeIndex + dist, len);
      const item = items[idx];
      const slide = createSlideElement(item, dist, activeTab);

      if (spreadFromCenter && !prefersReducedMotion()) {
        slide.style.transition = 'none';
        slide.style.setProperty('--Distance', (dist * 0.55).toFixed(3));
        slide.style.setProperty('--Depth', (Math.abs(dist) + 0.35).toFixed(3));
      }

      gallery.appendChild(slide);
      createdSlides.push({ slide, dist });

      if (activeTab === 'skins') {
        const viewer = mountSkinViewer(slide, item.skinConfig);
        if (viewer) skinViewers.push(viewer);
      }
    });

    if (spreadFromCenter && !prefersReducedMotion()) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          createdSlides.forEach(({ slide, dist }) => {
            slide.style.transition = '';
            slide.style.setProperty('--Distance', String(dist));
            slide.style.setProperty('--Depth', String(Math.abs(dist)));
          });
        });
      });
    }

    updateCaption(false);
  }

  function step(dir) {
    if (!dir) return;
    const items = DECKS[activeTab];
    const len = items.length;

    // For 3D WebGL skin canvases or reduced-motion, use clean deck swap
    if (prefersReducedMotion() || activeTab === 'skins') {
      activeIndex = wrapIndex(activeIndex + dir, len);
      renderDeck({ spreadFromCenter: false });
      return;
    }

    clearTimeout(stepCleanupTimer);
    activeIndex = wrapIndex(activeIndex + dir, len);

    // Prune any previously exiting slides from rapid clicks
    gallery.querySelectorAll('.HeroSlide.is-exiting').forEach((el) => el.remove());

    const existingSlides = Array.from(gallery.querySelectorAll('.HeroSlide'));
    const enterDist = dir > 0 ? 1 : -1;
    const incomingIdx = wrapIndex(activeIndex + enterDist, len);
    const incomingSlide = createSlideElement(items[incomingIdx], enterDist, activeTab);

    // Spawn incoming slide just outside the 3-panel window with transitions paused
    incomingSlide.style.transition = 'none';
    incomingSlide.style.setProperty('--Distance', String(enterDist * 1.85));
    incomingSlide.style.setProperty('--Depth', '1.45');
    incomingSlide.style.opacity = '0';
    gallery.appendChild(incomingSlide);

    // Shift existing slides smoothly by -dir
    requestAnimationFrame(() => {
      existingSlides.forEach((s) => {
        const nextOffset = Number(s.dataset.offset) - dir;
        s.dataset.offset = String(nextOffset);
        s.dataset.active = nextOffset === 0 ? 'true' : 'false';
        s.style.setProperty('--TiltX', '0deg');
        s.style.setProperty('--TiltY', '0deg');
        s.style.setProperty('--Stretch', '0');
        s.style.setProperty('--Pull', '0');

        if (Math.abs(nextOffset) > 1) {
          s.classList.add('is-exiting');
          s.style.setProperty('--Distance', String(Math.sign(nextOffset) * 1.85));
          s.style.setProperty('--Depth', '1.45');
          s.style.opacity = '0';
        } else {
          s.style.setProperty('--Distance', String(nextOffset));
          s.style.setProperty('--Depth', String(Math.abs(nextOffset)));
          s.style.opacity = '';
        }
      });

      requestAnimationFrame(() => {
        incomingSlide.style.transition = '';
        incomingSlide.style.opacity = '';
        incomingSlide.style.setProperty('--Distance', String(enterDist));
        incomingSlide.style.setProperty('--Depth', '1');
      });
    });

    updateCaption(true);

    stepCleanupTimer = setTimeout(() => {
      gallery.querySelectorAll('.HeroSlide.is-exiting').forEach((el) => el.remove());
    }, 560);
  }

  function setTab(tabKey, tabIdx) {
    if (activeTab === tabKey) return;
    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = typeof tabIdx === 'number' ? tabIdx : TAB_ORDER.indexOf(tabKey);
    const dir = nextIdx >= prevIdx ? 1 : -1;

    activeTab = tabKey;
    activeIndex = 0;

    tabsWrap.style.setProperty('--TabIndex', String(nextIdx));
    tabsWrap.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-selected', b.dataset.tab === tabKey ? 'true' : 'false');
    });

    if (prefersReducedMotion()) {
      renderDeck();
      return;
    }

    const myToken = ++tabSwitchToken;
    clearTimeout(tabSwitchTimer);

    // Lock current gallery height before switching mode so height interpolates smoothly
    const startHeight = gallery.getBoundingClientRect().height;
    gallery.style.height = `${startHeight}px`;
    gallery.style.setProperty('--TabDir', String(dir));
    gallery.classList.remove('is-tab-entering');
    gallery.classList.add('is-tab-leaving');
    if (captionEl) captionEl.classList.add('is-swapping');

    tabSwitchTimer = setTimeout(() => {
      if (myToken !== tabSwitchToken) return;

      // Measure target height in the new mode without visual jump
      preview.dataset.mode = activeTab;
      gallery.style.height = '';
      const targetHeight = gallery.getBoundingClientRect().height;
      gallery.style.height = `${startHeight}px`;

      renderDeck({ spreadFromCenter: true });

      gallery.classList.remove('is-tab-leaving');
      gallery.classList.add('is-tab-entering');

      requestAnimationFrame(() => {
        if (myToken !== tabSwitchToken) return;
        gallery.style.height = `${targetHeight}px`;
        requestAnimationFrame(() => {
          if (myToken !== tabSwitchToken) return;
          gallery.classList.remove('is-tab-entering');
          if (captionEl) captionEl.classList.remove('is-swapping');
          tabSwitchTimer = setTimeout(() => {
            if (myToken !== tabSwitchToken) return;
            gallery.style.height = '';
          }, 520);
        });
      });
    }, 175);
  }

  tabsWrap.querySelectorAll('button').forEach((btn, idx) => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab, idx));
  });

  if (btnPrev) btnPrev.addEventListener('click', () => step(-1));
  if (btnNext) btnNext.addEventListener('click', () => step(1));

  preview.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });

  // Drag physics (--Stretch & --Pull matching isaeva.xyz)
  gallery.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, .skin3d-canvas-wrap')) return;
    isDragging = true;
    dragPointerId = e.pointerId;
    dragStartX = e.clientX;
    dragDelta = 0;
    gallery.dataset.dragging = 'true';
    gallery.setPointerCapture(e.pointerId);
  });

  gallery.addEventListener('pointermove', (e) => {
    const activeSlide = gallery.querySelector('.HeroSlide[data-active="true"]');

    if (isDragging) {
      dragDelta = e.clientX - dragStartX;
      const norm = Math.max(-1, Math.min(1, dragDelta / 420));
      const stretch = Math.min(0.055, Math.abs(norm) * 0.06);
      const pull = norm * 3.2;

      gallery.querySelectorAll('.HeroSlide:not(.is-exiting)').forEach((s) => {
        const baseDist = Number(s.dataset.offset);
        const liveDist = baseDist + norm * 0.65;
        s.style.setProperty('--Distance', liveDist.toFixed(3));
        s.style.setProperty('--Depth', Math.min(1.2, Math.abs(liveDist)).toFixed(3));
        s.style.setProperty('--Stretch', stretch.toFixed(4));
        s.style.setProperty('--Pull', pull.toFixed(3));
      });
      return;
    }

    // 3D perspective mouse tilt & blue specular sheen on the active slide
    if (activeSlide && activeTab !== 'skins') {
      const rect = activeSlide.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const rx = (e.clientX - rect.left) / rect.width - 0.5;
        const ry = (e.clientY - rect.top) / rect.height - 0.5;
        activeSlide.style.setProperty('--TiltY', `${(rx * 6.5).toFixed(2)}deg`);
        activeSlide.style.setProperty('--TiltX', `${(-ry * 5.2).toFixed(2)}deg`);
        activeSlide.style.setProperty('--SheenX', `${((rx + 0.5) * 100).toFixed(1)}%`);
        activeSlide.style.setProperty('--SheenY', `${((ry + 0.5) * 100).toFixed(1)}%`);
      }
    }
  });

  gallery.addEventListener('pointerleave', () => {
    const activeSlide = gallery.querySelector('.HeroSlide[data-active="true"]');
    if (activeSlide) {
      activeSlide.style.setProperty('--TiltX', '0deg');
      activeSlide.style.setProperty('--TiltY', '0deg');
    }
  });

  function finishDrag() {
    if (!isDragging) return;
    isDragging = false;
    gallery.dataset.dragging = 'false';
    if (dragPointerId !== null) {
      try {
        gallery.releasePointerCapture(dragPointerId);
      } catch {}
      dragPointerId = null;
    }
    if (dragDelta < -70) {
      step(1);
    } else if (dragDelta > 70) {
      step(-1);
    } else {
      // Snap slides smoothly back to resting offsets without destroying DOM
      gallery.querySelectorAll('.HeroSlide:not(.is-exiting)').forEach((s) => {
        const baseDist = Number(s.dataset.offset);
        s.style.setProperty('--Distance', String(baseDist));
        s.style.setProperty('--Depth', String(Math.abs(baseDist)));
        s.style.setProperty('--Stretch', '0');
        s.style.setProperty('--Pull', '0');
      });
    }
  }

  gallery.addEventListener('pointerup', finishDrag);
  gallery.addEventListener('pointercancel', finishDrag);

  renderDeck();

  return {
    openSkinsTab() {
      setTab('skins', 2);
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  };
}
