// ===================================================
// nav.js — เมนูกลาง + Admin indicator
// ===================================================

// ── ป้องกัน FOUT: ซ่อนหน้าจนกว่าฟอนต์จะพร้อม ──────
document.documentElement.classList.add('fonts-loading');
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.remove('fonts-loading');
  });
} else {
  document.documentElement.classList.remove('fonts-loading');
}

const SITE = {
  teacherName: "ครูเล็ก",
  subject: "วิทยาการคำนวณ, ออกแบบและเทคโนโลยี",
  school: "โรงเรียนตัวอย่าง",
  logo: "◆",
  contact: { email: "natthaphon@school.ac.th", line: "@kru_lek" },
  menuItems: [
    { label: "หน้าแรก",       href: "index.html"    },
    { label: "เกี่ยวกับครู",   href: "about.html"    },
    { label: "สื่อการสอน",    href: "materials.html" },
    { label: "ผลงานนักเรียน", href: "students.html"  },
    { label: "ปฏิทิน",        href: "calendar.html"  },
    { label: "ติดต่อครู",      href: "contact.html"   },
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
          <span class="nav-name" id="navTeacherName">${SITE.teacherName}</span>
          <span class="nav-sub" id="navSubject">${SITE.subject}</span>
        </div>
      </a>
      <button class="nav-hamburger" onclick="toggleMenu()" aria-label="เปิดเมนู">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        ${SITE.menuItems.map(item => `
          <li>
            <a href="${item.href}" class="nav-link ${currentPage === item.href ? "active" : ""}">
              ${item.label}
            </a>
          </li>
        `).join("")}
        <li id="navAdminItem" style="display:none;">
          <a href="admin.html" class="nav-link nav-link--admin ${currentPage === "admin.html" ? "active" : ""}">
            จัดการ
          </a>
        </li>
      </ul>
      <div id="navAuthArea" style="display:flex;align-items:center;gap:.5rem;margin-left:.5rem;flex-shrink:0;">
        <a href="admin.html" class="btn-nav-login" id="navLoginBtn">ครูล็อกอิน</a>
        <div id="navUserBadge" style="display:none;align-items:center;gap:.5rem;">
          <span style="font-family: 'Kanit', sans-serif;font-size:11px;color:var(--gray-dark);font-weight:700;" id="navUserEmail"></span>
          <button onclick="navLogout()" class="btn-nav-logout" title="ออกจากระบบ">↩</button>
        </div>
      </div>
    </div>
  `;
  document.body.prepend(nav);

  window.addEventListener("authChanged", e => _syncNavAuth(e.detail));
}

function _syncNavAuth(user) {
  const loginBtn  = document.getElementById("navLoginBtn");
  const userBadge = document.getElementById("navUserBadge");
  const userEmail = document.getElementById("navUserEmail");
  const adminItem = document.getElementById("navAdminItem");
  if (!loginBtn) return;
  if (user) {
    loginBtn.style.display = "none";
    userBadge.style.display = "flex";
    userEmail.textContent = user.email || "ครู";
    adminItem.style.display = "list-item";
  } else {
    loginBtn.style.display = "inline-flex";
    userBadge.style.display = "none";
    adminItem.style.display = "none";
  }
}

async function navLogout() {
  if (window._fbLogout) await window._fbLogout();
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

// ── Sync nav + footer กับ Firestore profile ──────────────
// ซ่อน nav-name ก่อน แล้วแสดงหลัง Firebase ตอบกลับ เพื่อไม่ให้เห็นกระพริบ
(async () => {
  const nameEl    = document.getElementById("navTeacherName");
  const subjectEl = document.getElementById("navSubject");
  if (nameEl) nameEl.style.opacity = "0";

  try {
    const { getDocument } = await import("./firebase.js");
    const profile = await getDocument("settings/profile");

    if (profile) {
      if (profile.name) {
        if (nameEl) nameEl.textContent = profile.name;
        document.querySelectorAll(".footer-teacher-name").forEach(e => e.textContent = profile.name);
        // อัพเดต hero ด้วยถ้ามี
        const heroName = document.getElementById("hero-name");
        if (heroName) heroName.textContent = profile.name;
      }
      if (profile.subject) {
        if (subjectEl) subjectEl.textContent = profile.subject;
        const heroSubject = document.getElementById("hero-subject");
        if (heroSubject) {
          const schoolSpan = document.getElementById("hero-school");
          const schoolText = schoolSpan ? schoolSpan.textContent : "";
          heroSubject.innerHTML = profile.subject + (schoolText ? ' | <span id="hero-school">' + schoolText + '</span>' : "");
        }
      }
      if (profile.school) {
        document.querySelectorAll(".footer-school, #hero-school").forEach(e => e.textContent = profile.school);
      }
    }
  } catch(e) {}

  // แสดงทุก element หลัง fetch ไม่ว่าจะสำเร็จหรือไม่
  if (nameEl) nameEl.style.opacity = "1";
  document.querySelectorAll(
    ".footer-teacher-name, .footer-school, #hero-name, #hero-subject, #hero-school"
  ).forEach(el => el.style.opacity = "1");
})();
