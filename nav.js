// ============================================================
//   nav.js — SHARED NAVIGATION & CONFIG
//   แก้ไขไฟล์นี้เพื่ออัพเดตเมนูและ config ทั้งเว็บไซต์
// ============================================================

// ===== SITE CONFIG =====
// แก้ชื่อเว็บ, tagline, และ paths ที่นี่
const SITE_CONFIG = {
  siteName:  "PORTFOLIO",
  tagline:   "Creative Works & Projects",
  adminPath: "admin.html",
  indexPath: "index.html",
};

// ===== PUBLIC NAVIGATION MENU =====
// เพิ่ม/ลด/แก้หัวข้อเมนูหน้าหลักที่นี่
// - label   : ข้อความแสดงบนเมนู
// - href    : ลิงก์ (ใช้ #section สำหรับ index, หรือ URL เต็มสำหรับหน้าอื่น)
// - filter  : ถ้าเป็น filter-tab ใส่ key ของ filter (null ถ้าไม่ใช่)
// - newTab  : true ถ้าต้องการเปิดแท็บใหม่
const NAV_MENU = [
  { label: "ผลงานทั้งหมด", href: "#all",   filter: "all"    },
  { label: "ออกแบบ",       href: "#design", filter: "design" },
  { label: "ภาพถ่าย",      href: "#photo",  filter: "photo"  },
  { label: "ศิลปะ",        href: "#art",    filter: "art"    },
  { label: "เกี่ยวกับ",    href: "#about",  filter: null     },
  // ---- เพิ่มหน้าใหม่ที่นี่ ----
  // { label: "บล็อก", href: "blog.html", filter: null },
];

// ===== ADMIN NAVIGATION MENU =====
// เพิ่มเมนูย่อยใน admin panel ที่นี่
// - label  : ข้อความแสดงบนเมนู
// - panel  : id ของ .panel element ใน admin.html
// - icon   : prefix icon (optional)
const ADMIN_NAV = [
  { label: "แดชบอร์ด", panel: "dashboard", icon: "◈" },
  { label: "ผลงาน",    panel: "works",     icon: "✦" },
  { label: "ตั้งค่า",  panel: "settings",  icon: "⚙" },
  // ---- เพิ่มเมนู admin ใหม่ที่นี่ ----
  // { label: "Analytics", panel: "analytics", icon: "◉" },
];

// ===== SOCIAL LINKS =====
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#",                        icon: "IG" },
  { label: "Behance",   href: "#",                        icon: "BE" },
  { label: "Email",     href: "mailto:hello@portfolio.com", icon: "✉" },
];

// ============================================================
//   RENDER FUNCTIONS
//   (ไม่ต้องแก้ด้านล่างนี้ ยกเว้นต้องการปรับ HTML structure)
// ============================================================

/**
 * renderNav(activePage, isAdmin)
 * @param {string}  activePage  - "index" | "admin" | ชื่อหน้าอื่น
 * @param {boolean} isAdmin     - true = แสดงเมนู admin ใน nav
 *
 * หน้าที่เป็น admin จะ:
 *   1. เพิ่ม class "nav-compact" ให้ nav (compact ตลอดเวลา)
 *   2. แสดงเมนู admin links (ADMIN_NAV) หลัง divider
 *   3. ซ่อนปุ่ม Admin และแสดง user chip แทน
 */
function renderNav(activePage = "index", isAdmin = false) {
  const isOnAdmin = activePage === "admin" || isAdmin;

  // Public links: ถ้าอยู่หน้า admin ให้ชี้ไปที่ index#section
  const publicLinks = NAV_MENU.map(item => {
    const href = isOnAdmin
      ? (item.href.startsWith('#') ? SITE_CONFIG.indexPath + item.href : item.href)
      : item.href;
    return `
      <a href="${href}"
         class="nav-link${item.filter ? ' filter-link' : ''}"
         data-filter="${item.filter || ''}"
         data-label="${item.label}"
         ${item.newTab ? 'target="_blank"' : ''}
      ><span>${item.label}</span></a>`;
  }).join('');

  // Admin links: แสดงเฉพาะหน้า admin
  const adminLinks = isOnAdmin ? `
    <div class="nav-divider" aria-hidden="true"></div>
    ${ADMIN_NAV.map((item, i) => `
      <a href="#"
         class="nav-link admin-link${i === 0 ? ' active-panel' : ''}"
         data-panel="${item.panel}"
         data-label="${item.icon} ${item.label}"
         onclick="switchPanelFromNav('${item.panel}',this);return false;"
      ><span>${item.icon} ${item.label}</span></a>`
    ).join('')}
  ` : '';

  // Right side: Admin ปุ่ม (index) หรือ user chip (admin)
  const actions = isOnAdmin
    ? `
      <div class="nav-user-chip" id="nav-user-chip">
        <img class="nav-user-avatar" id="nav-user-avatar" src="" alt="" referrerpolicy="no-referrer" />
        <span class="nav-user-name" id="nav-user-name">—</span>
        <button class="nav-logout-btn" onclick="doLogout()">ออกจากระบบ</button>
      </div>`
    : `<a href="${SITE_CONFIG.adminPath}" class="nav-btn admin-btn">Admin</a>`;

  return `
    <nav class="main-nav${isOnAdmin ? ' nav-compact' : ''}" id="main-nav">
      <div class="nav-logo">
        <a href="${SITE_CONFIG.indexPath}">${SITE_CONFIG.siteName}</a>
      </div>
      <div class="nav-links" id="nav-links">
        ${publicLinks}
        ${adminLinks}
      </div>
      <div class="nav-actions" id="nav-actions">
        ${actions}
        <button class="hamburger" id="hamburger" aria-label="เมนู">
          <span></span><span></span>
        </button>
      </div>
    </nav>`;
}

/**
 * renderFooter()
 * Render footer HTML — ใช้ SITE_CONFIG และ SOCIAL_LINKS
 */
function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">${SITE_CONFIG.siteName}</span>
          <p>${SITE_CONFIG.tagline}</p>
        </div>
        <div class="footer-social">
          ${SOCIAL_LINKS.map(s => `
            <a href="${s.href}" class="social-link" aria-label="${s.label}"
               target="${s.href.startsWith('mailto') ? '_self' : '_blank'}"
               rel="noopener">${s.icon}</a>`
          ).join('')}
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} ${SITE_CONFIG.siteName}. All rights reserved.</p>
      </div>
    </footer>`;
}

// ============================================================
//   INIT HELPERS — เรียก initNav() ในทุกหน้า
// ============================================================

/** Hamburger toggle */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  // ปิด menu เมื่อคลิก link ใน mobile
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/** Scroll → add .scrolled class to nav (index เท่านั้น) */
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav || nav.classList.contains('nav-compact')) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/**
 * initNavAuth()
 * แสดง user chip + ปุ่ม logout ใน nav เมื่อ login แล้ว
 * ทำงานได้ทั้ง index และ admin
 */
function initNavAuth() {
  const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyAFuMPVoy0jUamQtAFyTF_xZipjqjomEto",
    authDomain:        "ladakh-l.firebaseapp.com",
    projectId:         "ladakh-l",
    storageBucket:     "ladakh-l.firebasestorage.app",
    messagingSenderId: "730812029375",
    appId:             "1:730812029375:web:6e7f4907d4dff40f71290a",
  };

  Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
  ]).then(([{ initializeApp, getApps, getApp }, { getAuth, onAuthStateChanged, signOut }]) => {
    const app  = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);

    onAuthStateChanged(auth, user => {
      // --- admin.html: ใช้ chip ที่ inject ไว้แล้ว (renderNav) ---
      const chipEl    = document.getElementById('nav-user-chip');
      const avatarEl  = document.getElementById('nav-user-avatar');
      const nameEl    = document.getElementById('nav-user-name');
      const adminBtn  = document.querySelector('.admin-btn');

      if (chipEl) {
        // admin page — chip มีอยู่แล้วใน DOM
        if (user) {
          if (avatarEl) avatarEl.src = user.photoURL || '';
          if (nameEl)   nameEl.textContent = user.displayName || user.email;
          chipEl.classList.add('visible');
          if (adminBtn) adminBtn.style.display = 'none';
        } else {
          chipEl.classList.remove('visible');
          if (adminBtn) adminBtn.style.display = '';
        }
        return; // admin จัดการ auth state เองใน script หลัก
      }

      // --- index.html: สร้าง chip แบบ dynamic ---
      const navActions = document.getElementById('nav-actions');
      if (!navActions) return;
      const old = document.getElementById('_nav-user-chip-dyn');
      if (old) old.remove();

      if (user) {
        const chip = document.createElement('div');
        chip.id = '_nav-user-chip-dyn';
        chip.className = 'nav-user-chip visible';
        chip.innerHTML = `
          ${user.photoURL
            ? `<img class="nav-user-avatar" src="${user.photoURL}"
                referrerpolicy="no-referrer" alt="" />`
            : ''}
          <span class="nav-user-name">${user.displayName || user.email}</span>
          <button class="nav-logout-btn" id="_nav-logout-dyn">ออกจากระบบ</button>`;
        chip.querySelector('#_nav-logout-dyn')
            .addEventListener('click', () => signOut(auth));
        const hamburger = document.getElementById('hamburger');
        navActions.insertBefore(chip, hamburger || null);
        if (adminBtn) adminBtn.style.display = 'none';
      } else {
        if (adminBtn) adminBtn.style.display = '';
      }
    });
  });
}

/**
 * initNav(page, isAdmin)
 * เรียก function นี้ใน <script> ของทุกหน้า
 * ตัวอย่าง:
 *   initNav('index')         — หน้าหลัก
 *   initNav('admin', true)   — หน้า admin (แสดงเมนู admin)
 *   initNav('blog')          — หน้าใหม่ในอนาคต
 */
function initNav(page = 'index', isAdmin = false) {
  // inject nav
  const navRoot = document.getElementById('nav-root');
  if (navRoot) navRoot.innerHTML = renderNav(page, isAdmin);

  // inject footer (ถ้ามี)
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) footerRoot.innerHTML = renderFooter();

  // body class สำหรับ CSS mobile rules
  if (page === 'index') document.body.classList.add('is-index');

  initHamburger();
  initNavScroll();
  initNavAuth();
}
