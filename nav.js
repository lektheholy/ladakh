// ============================================================
//   nav.js — SHARED NAVIGATION & CONFIG
// ============================================================

const SITE_CONFIG = {
  siteName:  "PORTFOLIO",
  tagline:   "Creative Works & Projects",
  adminPath: "admin.html",
  indexPath: "index.html",
};

// เมนูสาธารณะ — เว้นว่างไว้ (ไม่มีเมนู)
const NAV_MENU = [];

// เมนู Admin panel
const ADMIN_NAV = [
  { label: "แดชบอร์ด",   panel: "dashboard",  icon: "◈" },
  { label: "ตั้งค่าเว็บ", panel: "settings",   icon: "⚙" },
];

// Social links
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#",                         icon: "IG" },
  { label: "Email",     href: "mailto:hello@portfolio.com", icon: "✉"  },
];

// ============================================================
//   RENDER FUNCTIONS
// ============================================================

function renderNav(activePage = "index", isAdmin = false) {
  const isOnAdmin = activePage === "admin" || isAdmin;

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

  const actions = isOnAdmin
    ? `
      <div class="nav-user-chip" id="nav-user-chip">
        <img class="nav-user-avatar" id="nav-user-avatar" src="" alt="" referrerpolicy="no-referrer" />
        <span class="nav-user-name" id="nav-user-name">—</span>
        <button class="nav-logout-btn" onclick="doLogout()">ออกจากระบบ</button>
      </div>`
    : `<a href="${SITE_CONFIG.adminPath}" class="nav-btn admin-btn" id="admin-nav-btn" style="display:none;">Admin</a>
       <button class="nav-btn login-btn" id="login-nav-btn" onclick="doLogin()">เข้าสู่ระบบ</button>`;

  return `
    <nav class="main-nav${isOnAdmin ? ' nav-compact' : ''}" id="main-nav">
      <div class="nav-logo">
        <a href="${SITE_CONFIG.indexPath}">${SITE_CONFIG.siteName}</a>
      </div>
      <div class="nav-links" id="nav-links">
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
//   INIT HELPERS
// ============================================================

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.classList.toggle('active');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
    });
  });
}

function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav || nav.classList.contains('nav-compact')) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

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
  ]).then(([{ initializeApp, getApps, getApp }, { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup }]) => {
    const app      = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
    const auth     = getAuth(app);
    const provider = new GoogleAuthProvider();

    // expose login/logout globally for nav buttons
    window._auth     = auth;
    window._provider = provider;
    window._signInWithPopup = signInWithPopup;
    window._signOut  = signOut;

    window.doLogin = async function() {
      try { await signInWithPopup(auth, provider); }
      catch(e) { console.error(e); }
    };
    window.doLogout = async function() {
      try { await signOut(auth); window.location.href = window._SITE_INDEX || 'index.html'; }
      catch(e) { console.error(e); }
    };

    onAuthStateChanged(auth, user => {
      const chipEl   = document.getElementById('nav-user-chip');
      const avatarEl = document.getElementById('nav-user-avatar');
      const nameEl   = document.getElementById('nav-user-name');
      const adminBtn = document.getElementById('admin-nav-btn');
      const loginBtn = document.getElementById('login-nav-btn');

      if (chipEl) {
        // admin page
        if (user) {
          if (avatarEl) avatarEl.src = user.photoURL || '';
          if (nameEl)   nameEl.textContent = user.displayName || user.email;
          chipEl.classList.add('visible');
        } else {
          chipEl.classList.remove('visible');
        }
        return;
      }

      // index page
      const navActions = document.getElementById('nav-actions');
      if (!navActions) return;

      const old = document.getElementById('_nav-user-chip-dyn');
      if (old) old.remove();

      if (user) {
        // logged in: show Admin button, hide login btn, show user chip
        if (adminBtn) adminBtn.style.display = '';
        if (loginBtn) loginBtn.style.display = 'none';

        const chip = document.createElement('div');
        chip.id = '_nav-user-chip-dyn';
        chip.className = 'nav-user-chip visible';
        chip.innerHTML = `
          ${user.photoURL ? `<img class="nav-user-avatar" src="${user.photoURL}" referrerpolicy="no-referrer" alt="" />` : ''}
          <span class="nav-user-name">${user.displayName || user.email}</span>
          <button class="nav-logout-btn" id="_nav-logout-dyn">ออกจากระบบ</button>`;
        chip.querySelector('#_nav-logout-dyn')
            .addEventListener('click', () => signOut(auth));
        const hamburger = document.getElementById('hamburger');
        navActions.insertBefore(chip, hamburger || null);
      } else {
        // not logged in: hide admin btn, show login btn
        if (adminBtn) adminBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = '';
      }
    });
  });
}

function initNav(page = 'index', isAdmin = false) {
  const navRoot = document.getElementById('nav-root');
  if (navRoot) navRoot.innerHTML = renderNav(page, isAdmin);

  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) footerRoot.innerHTML = renderFooter();

  initHamburger();
  initNavScroll();
  initNavAuth();
}
