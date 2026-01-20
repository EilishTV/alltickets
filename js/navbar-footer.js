// -----------------------------
// 📌 Detectar basePath
// -----------------------------
let basePath = "/";
if (window.location.hostname.includes("github.io") || window.location.hostname.includes("gitlab.io")) {
  const pathParts = window.location.pathname.split("/").filter(p => p !== "");
  basePath = `/${pathParts[0]}/`;
}

// -----------------------------
// 📌 Crear Navbar
// -----------------------------
function crearNavbar() {
  const navbarHTML = `
  <nav class="navbar">
    <div class="navbar-logo">
      <a href="${basePath}">
        <img src="${basePath}assets/images/logo.png" alt="Logo">
      </a>
    </div>

    <div class="navbar-links">
      <a href="${basePath}">Eventos</a>
      <a href="#">Search</a>
      <a href="${basePath}pages/contact/">Soporte</a>
    </div>

    <div class="navbar-cart">
      <a href="#">Mis Entradas</a>
      <span id="user-container">
        <a href="${basePath}login/"><i class="fas fa-user"></i> Ingresar</a>
      </span>
    </div>

    <div class="navbar-toggle" onclick="toggleMenu()">☰</div>
  </nav>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) navbarContainer.innerHTML = navbarHTML;
}

// -----------------------------
// 📌 Crear Footer (HTML + CSS integrado)
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

      <div class="footer-bottom">© 2025 crowder</div>
    </div>
  </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// -----------------------------
// 📌 Mostrar usuario en Navbar
// -----------------------------
function mostrarUsuarioNavbar() {
  const userContainer = document.getElementById("user-container");
  const emailLogueado = localStorage.getItem("usuario_email");

  if (emailLogueado && userContainer) {
    const data = JSON.parse(localStorage.getItem("usuario_" + emailLogueado));
    if (data) {
      userContainer.innerHTML = `
        ${data.firstName}
        <a href="#" id="logout">Salir</a>
      `;

      document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("usuario_email");
        location.reload();
      });
    }
  }
}

// -----------------------------
// 📌 Inicializar
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  crearNavbar();
  crearFooter();
  mostrarUsuarioNavbar();
});
