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
          >${item.label}</a>
        `).join('')}
      </div>
      <div class="nav-actions">
        ${isAdmin
          ? `<a href="${SITE_CONFIG.indexPath}" class="nav-btn">← กลับหน้าหลัก</a>`
          : `<a href="${SITE_CONFIG.adminPath}" class="nav-btn admin-btn">Admin</a>`
        }
        <button class="hamburger" id="hamburger" aria-label="เมนู">
          <span></span><span></span><span></span>
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
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
      btn.classList.toggle('active');
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
