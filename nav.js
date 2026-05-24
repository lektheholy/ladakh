// ===================================================
// nav.js — เมนูกลาง + Admin indicator
// ===================================================

const SITE = {
  teacherName: "ครูเล็ก",
  subject: "วิทยาศาสตร์ | มัธยมศึกษาตอนต้น",
  school: "โรงเรียนตัวอย่าง",
  logo: "🔬",
  contact: { email: "natthaphon@school.ac.th", line: "@kru_lek" },
  menuItems: [
    { label: "หน้าแรก",       href: "index.html",    icon: "🏠" },
    { label: "เกี่ยวกับครู",   href: "about.html",    icon: "👩‍🏫" },
    { label: "สื่อการสอน",    href: "materials.html", icon: "📚" },
    { label: "ผลงานนักเรียน", href: "students.html",  icon: "🏆" },
    { label: "ปฏิทิน",        href: "calendar.html",  icon: "📅" },
    { label: "ติดต่อครู",      href: "contact.html",   icon: "📬" },
  ],
};

function buildNav() {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.id = "siteNav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-brand">
        <span class="nav-logo">${SITE.logo}</span>
        <div class="nav-brand-text">
          <span class="nav-name">${SITE.teacherName}</span>
          <span class="nav-sub">${SITE.subject}</span>
        </div>
      </a>
      <button class="nav-hamburger" onclick="toggleMenu()" aria-label="เปิดเมนู">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        ${SITE.menuItems.map(item => `
          <li>
            <a href="${item.href}" class="nav-link ${currentPage === item.href ? "active" : ""}">
              <span class="nav-icon">${item.icon}</span>${item.label}
            </a>
          </li>
        `).join("")}
        <li id="navAdminItem" style="display:none;">
          <a href="admin.html" class="nav-link nav-link--admin ${currentPage === "admin.html" ? "active" : ""}">
            <span class="nav-icon">⚙️</span>จัดการ
          </a>
        </li>
      </ul>
      <div id="navAuthArea" style="display:flex;align-items:center;gap:.5rem;margin-left:.5rem;flex-shrink:0;">
        <a href="admin.html" class="btn-nav-login" id="navLoginBtn">🔐 ครูล็อกอิน</a>
        <div id="navUserBadge" style="display:none;align-items:center;gap:.5rem;">
          <span style="font-size:12px;color:var(--green-mid);font-weight:600;" id="navUserEmail"></span>
          <button onclick="navLogout()" class="btn-nav-logout" title="ออกจากระบบ">↩</button>
        </div>
      </div>
    </div>
  `;
  document.body.prepend(nav);

  // Firebase auth listener — ถ้าโหลด Firebase
  if (typeof firebase !== "undefined" || window._fbAuth) {
    _syncNavAuth(window._fbAuth);
  }
  window.addEventListener("authChanged", e => _syncNavAuth(e.detail));
}

function _syncNavAuth(user) {
  const loginBtn    = document.getElementById("navLoginBtn");
  const userBadge   = document.getElementById("navUserBadge");
  const userEmail   = document.getElementById("navUserEmail");
  const adminItem   = document.getElementById("navAdminItem");
  if (!loginBtn) return;
  if (user) {
    loginBtn.style.display = "none";
    userBadge.style.display = "flex";
    userEmail.textContent = "🟢 " + (user.email || "ครู");
    adminItem.style.display = "list-item";
  } else {
    loginBtn.style.display = "inline-flex";
    userBadge.style.display = "none";
    adminItem.style.display = "none";
  }
}

async function navLogout() {
  // ลองเรียก logout จาก firebase module ถ้ามี
  if (window._fbLogout) {
    await window._fbLogout();
  }
  window.dispatchEvent(new CustomEvent("authChanged", { detail: null }));
  window.location.href = "index.html";
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}
document.addEventListener("click", e => {
  if (!e.target.closest(".site-nav")) {
    document.getElementById("navLinks")?.classList.remove("open");
  }
});

buildNav();

// ── Sync nav with Firestore profile ──────────────
(async () => {
  try {
    // dynamic import to avoid breaking pages that don't use modules
    const { getDocument } = await import("./firebase.js");
    const profile = await getDocument("settings/profile");
    if (!profile) return;
    if (profile.name) {
      const el = document.querySelector(".nav-name");
      if (el) el.textContent = profile.name;
      document.querySelectorAll(".footer-teacher-name").forEach(e => e.textContent = profile.name);
    }
    if (profile.subject) {
      const el = document.querySelector(".nav-sub");
      if (el) el.textContent = profile.subject;
    }
    if (profile.school) {
      document.querySelectorAll(".footer-school").forEach(e => e.textContent = profile.school);
    }
  } catch(e) {}
})();
