import { initBg3D } from './bg3d.js';
import { initCarousel } from './carousel.js';

const RELEASE_TAG = 'v11.1.3';
const GITHUB_REPO = 'https://github.com/flyingenes/wipe-launcher';

/**
 * Bilingual dictionary (English / Turkish) mirroring WIPE v11.1's real i18n.js support.
 */
const I18N = {
  en: {
    'nav.download': 'Download',
    'hero.desc':
      'Tired of bloated Minecraft launchers filled with ads and telemetry? Meet WIPE 11.1. Native Modrinth integration, automatic Java provisioning, Ely.by skins, built-in GitHub auto-updater, and isolated instances — free and open source.',
    'hero.dlSetup': 'Download v11.1',
    'hero.portable': 'Portable Build',
    'hero.javaMatrix': 'Java Matrix',
    'hero.compare': 'Compare',
    'links.whatsNew': 'What’s New in 11.1',
    'links.features': 'Features',
    'links.compare': 'Comparison',
    'links.java': 'Java 8–25 Matrix',
    'links.skins': '3D Skins',
    'links.github': 'GitHub',
    'links.license': 'GPL-3.0 License',
    'tabs.interface': 'Interface',
    'tabs.modrinth': 'Modrinth',
    'tabs.skins': '3D Skins',
    'eco.title': 'Built on open ecosystems',
    'cmp.heading': 'One launcher. Everything included.',
    'wn.badge': 'RELEASE V11.1',
    'wn.heading': 'What’s new in WIPE 11.1.',
    'wn.lead':
      'Built-in GitHub Release auto-updates, fluid directional motion choreography, local Yggdrasil skin injection, and our pure obsidian Satoshi interface.',
    'wn.c1Title': 'Native GitHub Auto Updater',
    'wn.c1Desc':
      'Checks GitHub Releases on startup, renders structured changelogs inside the in-app Update Available modal, detects NSIS vs Portable mode, and streams updates with live MB/s progress.',
    'wn.c2Title': 'Fluid Spatial Tab Choreography',
    'wn.c2Desc':
      'Spring-gliding navbar pill indicator paired with directional blur-and-scale view transitions, staggered slot reveals, and smooth settings sub-panel crossfades.',
    'wn.c3Title': 'Yggdrasil Skin & Cape Injection',
    'wn.c3Desc':
      'Embedded local Yggdrasil skin server and bundled authlib-injector deliver instant custom 64×64 PNG skins and one-click Ely.by OAuth HD capes directly in-game.',
    'wn.c4Title': 'Pure Obsidian & Satoshi UI',
    'wn.c4Desc':
      'Refined obsidian dark surfaces (#070708) and high-contrast Light Mode powered by bundled Satoshi, LostInSouth, and JetBrains Mono typography with zero bloat.',
    'feat.heading': 'Make every detail yours.',
    'feat.lead':
      'Engineered around speed, isolated instances, and native tooling — without ads, upsells, or bloated background services.',
    'f1.title': 'Isolated versions, every loader.',
    'f1.desc':
      'Create clean, self-contained profiles for Fabric, Forge, NeoForge, Quilt, and Vanilla fetched directly from Mojang’s version_manifest_v2.json. Every version keeps its own mods, shaders, resourcepacks, and saves with SHA-1 verified downloads.',
    'f2.title': 'Modrinth v2 with automatic dependencies.',
    'f2.desc':
      'Search and install mods, resource packs, and shaders straight into your active instance. WIPE automatically inspects required dependencies and resolves shader runtimes — pulling Iris + Sodium on Fabric/Quilt or Oculus on Forge.',
    'f3.title': 'Auto-provisioned Java 8 through 25.',
    'f3.desc':
      'Never hunt for JDK installers again. WIPE scans system Java installations and automatically provisions matching Eclipse Adoptium JRE builds from Java 8 (MC 1.8) up to Java 25 (MC 26+), paired with per-profile -Xmx sliders and G1GC flags.',
    'f4.title': 'Ely.by skins, offline UUIDs, live Discord RPC.',
    'f4.desc':
      'Authorize your Ely.by account in one click for synced HD skins and capes, or create offline accounts using RFC 4122 v3 MD5 UUIDs. Includes live stdout/stderr console diagnostics, EN/TR localization, Dark & Light themes, and Discord Rich Presence.',
    'f5.title': 'Seamless GitHub Release auto-updates.',
    'f5.desc':
      'Stay current without hunting for links. WIPE V11.1 verifies the latest GitHub Release on startup, displays full patch notes in-app, picks the matching NSIS or Portable binary, and installs updates in one click.',
    'f4.cta': 'Download v11.1',
    'closing.heading': 'Launch your next world.',
    'closing.primary': 'Get WIPE 11.1',
    'closing.secondary': 'Explore 3D Skins',
    'dl.modalTitle': 'Download WIPE 11.1',
    'dl.modalSub': 'Choose between the standard Windows NSIS installer or single-file portable build.',
    'dl.setupName': 'NSIS Setup Installer',
    'dl.setupDesc': 'Custom installation directory, Desktop & Start Menu shortcuts, built-in auto updater.',
    'dl.portableName': 'Portable Executable',
    'dl.portableDesc': 'Single x64 binary built via electron-builder — launch anywhere with zero install.',
    'dl.btnSetup': 'Download WIPE V11.1.3 Setup.exe',
    'dl.btnPortable': 'Download WIPE V11.1.3.exe',
  },
  tr: {
    'nav.download': 'İndir',
    'hero.desc':
      'Reklam ve telemetri dolu ağır Minecraft launcher’larından sıkıldın mı? WIPE 11.1 ile tanış. Yerleşik Modrinth entegrasyonu, otomatik Java kurulumu, Ely.by skin senkronizasyonu, otomatik güncelleyici ve izole sürümler — tamamen ücretsiz ve açık kaynak.',
    'hero.dlSetup': 'v11.1 İndir',
    'hero.portable': 'Taşınabilir Sürüm',
    'hero.javaMatrix': 'Java Matrisi',
    'hero.compare': 'Karşılaştır',
    'links.whatsNew': 'V11.1 Yenilikleri',
    'links.features': 'Özellikler',
    'links.compare': 'Karşılaştırma',
    'links.java': 'Java 8–25 Matrisi',
    'links.skins': '3D Skinler',
    'links.github': 'GitHub',
    'links.license': 'GPL-3.0 Lisans',
    'tabs.interface': 'Arayüz',
    'tabs.modrinth': 'Modrinth',
    'tabs.skins': '3D Skin',
    'eco.title': 'Açık ekosistemler üzerine inşa edildi',
    'cmp.heading': 'Tek launcher. Her şey dahil.',
    'wn.badge': 'SÜRÜM V11.1',
    'wn.heading': 'WIPE 11.1 ile neler yeni.',
    'wn.lead':
      'Yerleşik GitHub otomatik güncelleme sistemi, akıcı yönsel sekme koreografisi, yerel Yggdrasil kostüm sunucusu ve saf obsidyen Satoshi arayüzü.',
    'wn.c1Title': 'Yerel GitHub Otomatik Güncelleyici',
    'wn.c1Desc':
      'Başlangıçta GitHub Releases sürümlerini denetler, GÜNCELLEME BULUNDU penceresinde yama notlarını gösterir, NSIS veya Taşınabilir yapıyı algılar ve canlı MB/s ilerleme çubuğuyla kurar.',
    'wn.c2Title': 'Akıcı Yönsel Sekme Koreografisi',
    'wn.c2Desc':
      'Üst menüde kayan aktif sekme göstergesi, yönsel blur ve ölçek geçişli sayfalar, kademeli içerik girişleri ve takılmayan ayar alt panelleri.',
    'wn.c3Title': 'Yggdrasil Skin ve Pelerin Sunucusu',
    'wn.c3Desc':
      'Yerleşik yerel Yggdrasil sunucusu ve authlib-injector ile özel 64×64 PNG kostümler ve tek tıkla Ely.by OAuth HD pelerinler doğrudan oyuna aktarılır.',
    'wn.c4Title': 'Saf Obsidyen ve Satoshi Arayüz',
    'wn.c4Desc':
      'Satoshi, LostInSouth ve JetBrains Mono tipografisiyle güçlendirilmiş #070708 saf obsidyen yüzeyler ve yüksek kontrastlı Aydınlık Mod.',
    'feat.heading': 'Her detayı kendin kontrol et.',
    'feat.lead':
      'Hız, izole profil klasörleri ve yerel araçlar etrafında tasarlandı — reklam yok, gizli servis yok, gereksiz yük yok.',
    'f1.title': 'İzole sürümler, tüm mod yükleyiciler.',
    'f1.desc':
      'Mojang’ın resmi version_manifest_v2.json kaynağından Fabric, Forge, NeoForge, Quilt ve Vanilla için temiz profiller oluştur. Her profil kendi mods, shaderpacks, resourcepacks ve saves klasörünü SHA-1 doğrulamasıyla izole tutar.',
    'f2.title': 'Otomatik bağımlılık çözen Modrinth v2.',
    'f2.desc':
      'Modları, kaynak paketlerini ve shader’ları doğrudan aktif profiline kur. WIPE gerekli kütüphaneleri ve shader çalışma zamanlarını (Fabric/Quilt için Iris + Sodium, Forge için Oculus) otomatik algılar ve kurar.',
    'f3.title': 'Java 8’den 25’e otomatik Adoptium kurulumu.',
    'f3.desc':
      'Bir daha JDK indirmekle uğraşma. WIPE sistemindeki Java kurulumlarını tarar ve Minecraft sürümüne uygun Eclipse Adoptium JRE’yi (Java 8, 17, 21, 25) otomatik indirir; -Xmx RAM kaydırıcısı ve G1GC bayrakları doğrudan elinin altındadır.',
    'f4.title': 'Ely.by skinleri, offline UUID ve canlı Discord RPC.',
    'f4.desc':
      'Tek tıkla Ely.by OAuth ile HD skin ve pelerinlerini senkronize et ya da RFC 4122 v3 MD5 UUID destekli offline hesap oluştur. Canlı konsol günlükleri, EN/TR dil desteği, Karanlık/Aydınlık tema ve Discord Rich Presence dahildir.',
    'f5.title': 'Kesintisiz GitHub otomatik güncellemeleri.',
    'f5.desc':
      'Link aramakla uğraşma. WIPE V11.1 açılışta en yeni GitHub sürümünü kontrol eder, değişiklik notlarını uygulama içinde sunar ve uygun NSIS ya da Taşınabilir paketi tek tıkla indirip kurar.',
    'f4.cta': 'v11.1 İndir',
    'closing.heading': 'Sıradaki dünyanı başlat.',
    'closing.primary': 'WIPE 11.1’i Edin',
    'closing.secondary': '3D Skinleri İncele',
    'dl.modalTitle': 'WIPE 11.1 İndir',
    'dl.modalSub': 'Standart Windows NSIS kurulum sihirbazı veya tek dosyalık taşınabilir sürüm arasından seç.',
    'dl.setupName': 'NSIS Kurulum Sihirbazı',
    'dl.setupDesc': 'Özel kurulum dizini, Masaüstü ve Başlat Menüsü kısayolları, yerleşik otomatik güncelleyici.',
    'dl.portableName': 'Taşınabilir Çalıştırılabilir (.exe)',
    'dl.portableDesc': 'Tek parça x64 çalıştırılabilir dosya — kurulum gerektirmeden istediğin klasörden başlat.',
    'dl.btnSetup': 'WIPE V11.1.3 Setup.exe İndir',
    'dl.btnPortable': 'WIPE V11.1.3.exe İndir',
  },
};

let currentLang = 'en';
let syncDownloadModalLang = null;

function initCursorSheen() {
  document.querySelectorAll('.landing-chip').forEach((chip) => {
    chip.addEventListener('pointermove', (e) => {
      const r = chip.getBoundingClientRect();
      chip.style.setProperty('--mx', `${e.clientX - r.left}px`);
      chip.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Subtle 3D tilt on Hero wordmark
  const wordmark = document.getElementById('HeroWordmark');
  if (wordmark && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (window.scrollY > 420) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        wordmark.style.transform = `rotateY(${(nx * 5.5).toFixed(2)}deg) rotateX(${(-ny * 4).toFixed(2)}deg)`;
      },
      { passive: true }
    );
  }
}

function initScrollEffects() {
  const nav = document.getElementById('LandingNav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const reveals = document.querySelectorAll('.reveal-el');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.02, rootMargin: '0px 0px 40px 0px' }
  );

  reveals.forEach((el) => io.observe(el));
}

function initModals() {
  const modals = {
    download: document.getElementById('ModalDownload'),
    java: document.getElementById('ModalJava'),
    license: document.getElementById('ModalLicense'),
  };

  let selectedBuild = 'setup';
  const buildSpecsEl = document.getElementById('DownloadSpecs');
  const dlStatusEl = document.getElementById('DownloadStatusMsg');
  const dlActionBtn = document.getElementById('BtnConfirmDownload');
  const dlActionLabel = document.getElementById('BtnConfirmDownloadLabel');

  const BUILD_INFO = {
    setup: {
      file: 'WIPE V11.1.3 Setup.exe',
      url: `${GITHUB_REPO}/releases/download/${RELEASE_TAG}/WIPE.V11.1.3.Setup.exe`,
      btnKey: 'dl.btnSetup',
      specs: {
        en:
          '<strong>Target:</strong> Windows 10/11 (x64) · NSIS Installer<br>' +
          '<strong>Runtime:</strong> Electron 34.5.8 · Auto-managed Adoptium JRE 8/17/21/25<br>' +
          '<strong>Updates:</strong> Built-in GitHub Release auto-updater · Preserves AppData on uninstall.',
        tr:
          '<strong>Hedef:</strong> Windows 10/11 (x64) · NSIS Kurulum Sihirbazı<br>' +
          '<strong>Çalışma Ortamı:</strong> Electron 34.5.8 · Otomatik Adoptium JRE 8/17/21/25<br>' +
          '<strong>Güncelleme:</strong> Yerleşik GitHub otomatik güncelleyici · Kaldırmada verileri korur.',
      },
    },
    portable: {
      file: 'WIPE V11.1.3.exe',
      url: `${GITHUB_REPO}/releases/download/${RELEASE_TAG}/WIPE.V11.1.3.exe`,
      btnKey: 'dl.btnPortable',
      specs: {
        en:
          '<strong>Target:</strong> Windows 10/11 (x64) · Single Portable Executable<br>' +
          '<strong>Runtime:</strong> Electron 34.5.8 · Zero installer required<br>' +
          '<strong>Options:</strong> Run directly from any folder or USB drive with auto-update support.',
        tr:
          '<strong>Hedef:</strong> Windows 10/11 (x64) · Tek Dosya Taşınabilir Sürüm<br>' +
          '<strong>Çalışma Ortamı:</strong> Electron 34.5.8 · Kurulum gerektirmez<br>' +
          '<strong>Özellik:</strong> İstediğin klasör veya taşınabilir diskten otomatik güncelleme desteğiyle çalıştır.',
      },
    },
  };

  function selectBuild(type) {
    selectedBuild = BUILD_INFO[type] ? type : 'setup';
    const info = BUILD_INFO[selectedBuild];
    const dict = I18N[currentLang] || I18N.en;

    document.querySelectorAll('[data-dl-option]').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.dlOption === selectedBuild);
    });
    if (buildSpecsEl) buildSpecsEl.innerHTML = info.specs[currentLang] || info.specs.en;
    if (dlActionBtn) dlActionBtn.href = info.url;
    if (dlActionLabel) dlActionLabel.textContent = dict[info.btnKey];
    if (dlStatusEl) {
      dlStatusEl.href = `${GITHUB_REPO}/releases/tag/${RELEASE_TAG}`;
      dlStatusEl.textContent = `GitHub Release ${RELEASE_TAG} · ${info.file}`;
    }
  }

  syncDownloadModalLang = () => selectBuild(selectedBuild);

  function openModal(key, preset) {
    Object.values(modals).forEach((m) => m && m.classList.remove('is-open'));
    const target = modals[key];
    if (!target) return;
    if (key === 'download' && preset) selectBuild(preset);
    target.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeAll() {
    Object.values(modals).forEach((m) => m && m.classList.remove('is-open'));
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.dataset.openModal, trigger.dataset.dlPreset);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAll);
  });

  Object.values(modals).forEach((m) => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m) closeAll();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  document.querySelectorAll('[data-dl-option]').forEach((btn) => {
    btn.addEventListener('click', () => selectBuild(btn.dataset.dlOption));
  });

  selectBuild('setup');
}

function initLanguageToggle() {
  const btn = document.getElementById('BtnLangToggle');
  if (!btn) return;

  function applyLang(next) {
    currentLang = next;
    const dict = I18N[currentLang];
    document.documentElement.lang = currentLang;
    btn.textContent = currentLang === 'en' ? 'TR' : 'EN';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    if (syncDownloadModalLang) syncDownloadModalLang();
  }

  btn.addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'tr' : 'en');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBg3D();
  const carousel = initCarousel();
  initCursorSheen();
  initScrollEffects();
  initModals();
  initLanguageToggle();

  document.querySelectorAll('[data-jump-skins]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (carousel) carousel.openSkinsTab();
    });
  });
});
