// -----------------------------
// 📌 Detectar basePath correcto (Live Server y GitHub Pages)
// -----------------------------
let basePath = "/";

// Si estamos en GitHub Pages
if (window.location.hostname.includes("github.io")) {
  let pathParts = window.location.pathname.split("/").filter(p => p !== "");
  basePath = `/${pathParts[0]}/`; // /nombre-del-repo/
}

// -----------------------------
// 📌 Función para crear navbar
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
      <a href="../../login"><i class="fas fa-user"></i> Ingresar</a>
    </div>

    <div class="navbar-toggle" onclick="toggleMenu()">☰</div>
  </nav>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
  }
}

// -----------------------------
// 📌 Loader
// -----------------------------
function crearLoader() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = `
    position: fixed; top:0; left:0;
    width:100%; height:100%;
    background-color:#f9f9f8;
    display:flex; justify-content:center; align-items:center;
    z-index:999;
  `;
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border:6px solid #f3f3f3;
    border-top:6px solid #6200EA;
    border-radius:50%;
    width:30px; height:30px;
    animation:spin 1s linear infinite;
  `;
  loadingDiv.appendChild(spinner);
  document.body.appendChild(loadingDiv);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
  `;
  document.head.appendChild(style);
}

// -----------------------------
// 📌 Crear sección de productos
// -----------------------------
function crearSeccionProductos(titulo, productos) {
  const containerGeneral = document.getElementById('productos-container');
  if (!containerGeneral) return;

  const seccion = document.createElement('div');
  seccion.classList.add('productos-section');

  if (titulo && titulo.trim() !== "") {
    const h2 = document.createElement('h2');
    h2.classList.add('section-title');
    h2.textContent = titulo;
    seccion.appendChild(h2);
  }

  const contenedorProductos = document.createElement('div');
  contenedorProductos.classList.add('productos-container');

  productos.forEach(({ img, nombre, lugar, precio, agotado }) => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');

    const idEvento = nombre
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(":", "")
      .replaceAll(".", "")
      .replaceAll("á", "a")
      .replaceAll("é", "e")
      .replaceAll("í", "i")
      .replaceAll("ó", "o")
      .replaceAll("ú", "u")
      .replaceAll("ñ", "n");

    const claseZoom = !agotado ? 'img-zoom' : '';

    productoDiv.innerHTML = `
      <a href="${basePath}pages/events/?id=${idEvento}" class="producto-link">
        <div class="imagen-contenedor">
          ${agotado ? '<div class="agotado-label">Sold Out</div>' : ''}
          <img src="${img}" alt="${nombre}" class="${claseZoom}">
        </div>
        <div class="producto-nombre"><span class="sin-subrayado">${nombre}</span></div>
        <div class="producto-precio"><span class="sin-subrayado">${precio || lugar}</span></div>
      </a>
    `;

    contenedorProductos.appendChild(productoDiv);
  });

  seccion.appendChild(contenedorProductos);
  containerGeneral.appendChild(seccion);
}

// -----------------------------
// 📌 Cargar eventos desde CSV
// -----------------------------
async function cargarEventos() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();

    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const eventos = result.data;

    const productos = eventos.map(e => ({
      img: e.img,
      nombre: e.nombre,
      lugar: e.lugar,
      precio: e.precio,
      agotado: (e.agotado || "").toUpperCase() === "TRUE"
    }));

    crearSeccionProductos("", productos);

  } catch (err) {
    console.error("Error cargando CSV:", err);
  } finally {
    const loader = document.getElementById('loading');
    if (loader) loader.remove();
  }
}

// -----------------------------
// 📌 Crear footer
// -----------------------------
function crearFooter() {
  const footerHTML = `
  <style>
    footer {
      background: #000000;
      color: #fff;
      padding: 40px 20px 20px 20px;
      text-align: center;
      position: relative;
      margin-top: 60px;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-logo {
      text-align: left;
      margin-bottom: 20px;
    }

    .footer-logo img {
      height: 50px;
    }

    .footer-links {
      display: flex;
      justify-content: left;
      flex-wrap: wrap;
      gap: 20px;
      margin: 20px 0;
      border-top: 1px solid #555;
      padding-top: 20px;
    }

    .footer-links a {
      color: #ccc;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s, text-decoration 0.3s;
    }

    .footer-links a:hover {
      color: #fff;
      text-decoration: underline; /* 🔹 Subrayado al pasar el mouse */
    }

    .footer-bottom {
      text-align: left;
      font-size: 13px;
      color: #888;
      margin-top: 30px;
    }
  </style>

  <footer>
    <div class="footer-container">
      <a href="${basePath}">
        <div class="footer-logo">
          <img src="${basePath}assets/images/logo-white.png" alt="Logo AllTickets">
        </div>
      </a>


      <div class="footer-links">
        <a href="${basePath}pages/contact/">Contacto y Soporte</a>
        <a href="${basePath}pages/tyc/">Términos y Condiciones</a>
        <a href="#">Privacidad</a>
        <a href="${basePath}pages/create">Vende con nosotros</a>
        <a href="#">Política de Cookies</a>
      </div>

      <div class="footer-bottom">
        © 2025 crowder
      </div>
    </div>
  </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// -----------------------------
// 📌 Inicializar
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  crearNavbar();
  crearLoader();
  cargarEventos();
  crearFooter();
});
