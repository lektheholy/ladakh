// ===== SHARED NAVIGATION & CONFIG =====
// แก้ไขไฟล์นี้เพื่ออัพเดตเมนูทั้งเว็บไซต์

const SITE_CONFIG = {
  siteName: "PORTFOLIO",
  tagline: "Creative Works & Projects",
  adminPath: "admin.html",
  indexPath: "index.html",
};

const NAV_MENU = [
  { label: "ผลงานทั้งหมด", href: "#all", filter: "all" },
  { label: "ออกแบบ", href: "#design", filter: "design" },
  { label: "ภาพถ่าย", href: "#photo", filter: "photo" },
  { label: "ศิลปะ", href: "#art", filter: "art" },
  { label: "เกี่ยวกับ", href: "#about", filter: null },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "IG" },
  { label: "Behance", href: "#", icon: "BE" },
  { label: "Email", href: "mailto:hello@portfolio.com", icon: "✉" },
];

// ===== RENDER FUNCTIONS =====

function renderNav(activePage = "index") {
  const isAdmin = activePage === "admin";
  return `
    <nav class="main-nav" id="main-nav">
      <div class="nav-logo">
        <a href="${SITE_CONFIG.indexPath}">${SITE_CONFIG.siteName}</a>
      </div>
      <div class="nav-links" id="nav-links">
        ${NAV_MENU.map(item => `
          <a href="${isAdmin ? SITE_CONFIG.indexPath : item.href}"
             class="nav-link ${item.filter ? 'filter-link' : ''}"
             data-filter="${item.filter || ''}"
          ><span>${item.label}</span></a>
        `).join('')}
      </div>
      <div class="nav-actions" id="nav-actions">
        ${isAdmin
          ? `<a href="${SITE_CONFIG.indexPath}" class="nav-btn">← กลับหน้าหลัก</a>`
          : `<a href="${SITE_CONFIG.adminPath}" class="nav-btn admin-btn">Admin</a>`
        }
        <button class="hamburger" id="hamburger" aria-label="เมนู">
          <span></span><span></span>
        </button>
      </div>
    </nav>
  `;
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
            <a href="${s.href}" class="social-link" target="_blank">${s.icon}</a>
          `).join('')}
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  `;
}

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
      btn.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
}

function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ===== FIREBASE AUTH IN NAV =====
// แสดงชื่อผู้ใช้ + ปุ่ม logout ใน nav เมื่อ login แล้ว
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
    // ป้องกัน initializeApp ซ้ำ
    const app  = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);

    onAuthStateChanged(auth, user => {
      const navActions = document.getElementById('nav-actions');
      if (!navActions) return;

      // ลบ chip เก่าถ้ามี
      const old = document.getElementById('nav-user-chip');
      if (old) old.remove();

      const adminBtn = navActions.querySelector('.admin-btn');

      if (user) {
        // สร้าง user chip
        const chip = document.createElement('div');
        chip.id = 'nav-user-chip';
        chip.style.cssText = 'display:flex;align-items:center;gap:.6rem;';
        chip.innerHTML = `
          ${user.photoURL
            ? `<img src="${user.photoURL}" referrerpolicy="no-referrer" alt=""
                style="width:26px;height:26px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);object-fit:cover;flex-shrink:0;">`
            : ''}
          <span style="font-size:0.68rem;letter-spacing:.06em;color:rgba(240,240,240,0.55);
                        max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${user.displayName || user.email}
          </span>
          <button id="nav-logout-btn"
            style="font-size:0.65rem;letter-spacing:.12em;text-transform:uppercase;
                   padding:.38rem .9rem;border:1px solid rgba(255,85,85,0.3);
                   color:rgba(255,85,85,0.75);background:transparent;
                   cursor:pointer;font-family:inherit;transition:all .3s;white-space:nowrap;">
            ออกจากระบบ
          </button>
        `;
        const logoutBtn = chip.querySelector('#nav-logout-btn');
        logoutBtn.addEventListener('mouseenter', () => {
          logoutBtn.style.borderColor = '#ff5555';
          logoutBtn.style.color       = '#ff5555';
          logoutBtn.style.background  = 'rgba(255,85,85,0.08)';
        });
        logoutBtn.addEventListener('mouseleave', () => {
          logoutBtn.style.borderColor = 'rgba(255,85,85,0.3)';
          logoutBtn.style.color       = 'rgba(255,85,85,0.75)';
          logoutBtn.style.background  = 'transparent';
        });
        logoutBtn.addEventListener('click', () => signOut(auth));

        // แทรกก่อน hamburger
        const hamburger = document.getElementById('hamburger');
        navActions.insertBefore(chip, hamburger || null);

        // ซ่อนปุ่ม Admin (login แล้วไม่จำเป็น)
        if (adminBtn) adminBtn.style.display = 'none';

      } else {
        // ยังไม่ login — แสดงปุ่ม Admin ปกติ
        if (adminBtn) adminBtn.style.display = '';
      }
    });
  });
}
