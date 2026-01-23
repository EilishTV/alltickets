// -----------------------------
// 📌 Detectar basePath
// -----------------------------
let basePath = "/";
if (
  window.location.hostname.includes("github.io") ||
  window.location.hostname.includes("gitlab.io")
) {
  const pathParts = window.location.pathname.split("/").filter(p => p !== "");
  basePath = `/${pathParts[0]}/`;
}

// -----------------------------
// 📌 Crear Navbar
// -----------------------------
function crearNavbar() {
  // 🔹 Determinar si estamos en mobile
  const isMobile = window.innerWidth <= 768;

  // Usuario (desktop)
  const email = localStorage.getItem("usuario_email");
  let userHTML = `<a href="${basePath}login/"><i class="fas fa-user"></i> Ingresar</a>`;
  let misEntradasHTML = '';

  if (email) {
    const rawData = localStorage.getItem("usuario_" + email);
    if (rawData) {
      try {
        const userData = JSON.parse(rawData);
        if (userData.firstName) {
          userHTML = `
            <span class="navbar-user">
              <i class="fas fa-user"></i> 
              <a href="${basePath}account/perfil" style="color:inherit; text-decoration:none;">
                ${userData.firstName}
              </a>
            </span>
          `;
          misEntradasHTML = `<a href="${basePath}account/purchases">Mis Entradas</a>`;
        }
      } catch {}
    }
  }

  // 🔹 En mobile: NO agregar ingresar ni mis entradas
  if (isMobile) {
    userHTML = ''; 
    misEntradasHTML = '';
  }

  const navbarHTML = `
    <nav class="navbar">
      <div class="navbar-logo">
        <a href="${basePath}">
          <img src="${basePath}assets/images/logo.png" alt="Logo">
        </a>
      </div>

      <div class="navbar-cart">
        <span id="mis-entradas">${misEntradasHTML}</span>
        <span id="user-container">${userHTML}</span>
      </div>

      <div class="navbar-toggle">☰</div>
    </nav>

    <!-- 📱 Menu Mobile -->
    <div id="mobile-menu" style="display:none;"></div>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;

    // 🔹 Listener para el toggle
    const toggleBtn = navbarContainer.querySelector(".navbar-toggle");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleMenu);
  }
}


// -----------------------------
// 📌 Toggle menú mobile (SOLO CELULARES)
// -----------------------------
function toggleMenu() {
  if (window.innerWidth > 768) return; // desktop: no hace nada

  const menu = document.getElementById("mobile-menu");
  if (!menu) return;

  // Obtener usuario
  const email = localStorage.getItem("usuario_email");
  let userLinks = "";

  if (email) {
    const rawData = localStorage.getItem("usuario_" + email);
    if (rawData) {
      try {
        const userData = JSON.parse(rawData);
        if (userData.firstName) {
          // Usuario logueado en mobile
          userLinks = `
            <a href="${basePath}account/perfil">${userData.firstName}</a>
            <a href="${basePath}account/purchases">Mis entradas</a>
          `;
        }
      } catch {}
    }
  }

  // Si no hay usuario logueado
  if (!userLinks) {
    userLinks = `<a href="${basePath}login/">Ingresar</a>`;
  }

  // Siempre agregar soporte
  userLinks += `<a href="${basePath}pages/contact/">Soporte</a>`;

  // Crear el HTML del menú mobile
  menu.innerHTML = `
    <style>
      #mobile-menu {
        position: fixed;
        top: 4.9rem;
        left: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #ddd;
        z-index: 9999;

        overflow: hidden;
        max-height: 0;
        transition: max-height 0.35s ease;
      }

      #mobile-menu.open {
        max-height: 300px;
      }

      #mobile-menu a {
        text-align: center;
        display: block;
        padding: 20px 16px;
        border-bottom: 1px solid #e5e5e5;
        color: #000;
        text-decoration: none;
        font-size: 15px;
        transition: background 0.2s;
      }

      #mobile-menu a:hover {
        background: rgba(0,0,0,0.05);
      }

      #mobile-menu a:active {
        background: rgba(0,0,0,0.1);
      }

      /* 🔹 Ocultar nav fijo en mobile */
      @media screen and (max-width: 768px) {
        #user-container a,
        #mis-entradas {
          display: none;
        }
      }
    </style>

    ${userLinks}
  `;

  // Mostrar y animar
  menu.style.display = "block";
  requestAnimationFrame(() => {
    menu.classList.toggle("open");
  });
}

// -----------------------------
// 📌 Mostrar usuario desde localStorage (SOLO DESKTOP)
// -----------------------------
function mostrarUsuarioNavbar() {
  if (window.innerWidth <= 768) return; // celular: no tocar navbar normal

  const email = localStorage.getItem("usuario_email");
  if (!email) return;

  const rawData = localStorage.getItem("usuario_" + email);
  if (!rawData) return;

  let userData;
  try {
    userData = JSON.parse(rawData);
  } catch {
    return;
  }

  if (!userData.firstName) return;

  const userContainer = document.getElementById("user-container");
  const misEntradas = document.getElementById("mis-entradas");

  if (!userContainer) return;

  if (misEntradas) {
    misEntradas.innerHTML = `
      <a href="${basePath}account/purchases">Mis Entradas</a>
    `;
  }

  userContainer.innerHTML = `
    <span class="navbar-user">
      <i class="fas fa-user"></i> 
      <a href="${basePath}account/perfil" style="color:inherit; text-decoration:none;">
        ${userData.firstName}
      </a>
    </span>
  `;
}

// -----------------------------
// 📌 Crear Footer (NO TOCAR)
// -----------------------------
function crearFooter() {
  const footerHTML = `
  <style>
    footer.footer {
      background: #000;
      color: #fff;
      padding: 40px 20px 20px;
      margin-top: 60px;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-logo {
      margin-bottom: 20px;
    }
    .footer-logo img {
      height: 50px;
    }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin: 20px 0;
      padding-top: 20px;
      border-top: 1px solid #555;
    }
    .footer-links a {
      color: #ccc;
      text-decoration: none;
      font-size: 14px;
      transition: 0.3s;
    }
    .footer-links a:hover {
      color: #fff;
      text-decoration: underline;
    }
    .footer-bottom {
      font-size: 13px;
      color: #888;
      margin-top: 30px;
    }
  </style>

  <footer class="footer">
    <div class="footer-container">
      <a href="${basePath}">
        <div class="footer-logo">
          <img src="${basePath}assets/images/logo-white.png" alt="Logo">
        </div>
      </a>

      <div class="footer-links">
        <a href="${basePath}pages/contact/">Contacto y Soporte</a>
        <a href="${basePath}pages/tyc/">Términos y Condiciones</a>
        <a href="#">Privacidad</a>
        <a href="${basePath}pages/create">Vende con nosotros</a>
        <a href="#">Política de Cookies</a>
      </div>

      <div class="footer-bottom">© 2026 crowder</div>
    </div>
  </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// -----------------------------
// 📌 Inicializar todo
// -----------------------------
function inicializarNavbar() {
  crearNavbar();
  mostrarUsuarioNavbar();
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  inicializarNavbar();
  crearFooter();
});

// Ejecutar al cambiar tamaño
window.addEventListener("resize", () => {
  inicializarNavbar();
});
