// ===================================================
// nav.js — เมนูกลาง แก้ที่นี่ที่เดียว อัพเดตทุกหน้า
// ===================================================

const SITE = {
  teacherName: "ครูสมหญิง วิชาการดี",
  subject: "วิทยาศาสตร์ | มัธยมศึกษาตอนต้น",
  school: "โรงเรียนตัวอย่าง",
  logo: "🔬",
  contact: {
    email: "somying@school.ac.th",
    line: "@krusom",
  },
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
            <a href="${item.href}"
               class="nav-link ${currentPage === item.href ? "active" : ""}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  document.body.prepend(nav);
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ปิดเมนูเมื่อคลิกนอก
document.addEventListener("click", e => {
  if (!e.target.closest(".site-nav")) {
    document.getElementById("navLinks")?.classList.remove("open");
  }
});

buildNav();
