// Calculamos la profundidad de la carpeta actual
let depth = window.location.pathname.split("/").length - 2; // restamos 2: dominio + repo
let basePath = "";
for (let i = 0; i < depth; i++) {
  basePath += "../";
}

// Navbar dinámico
const navbarHTML = `
<nav class="navbar">
  <div class="navbar-logo">
    <a href="${basePath}index.html">
      <img src="${basePath}assets/images/logo.png" alt="Logo">
    </a>
  </div>

  <div class="navbar-links">
    <a href="${basePath}index.html">Eventos</a>
    <a href="#">Search</a>
    <a href="${basePath}pages/contact/">Soporte</a>
  </div>

  <div class="navbar-cart">
    <a href="#">Mis Entradas</a>
    <a href="#"><i class="fas fa-user"></i> Ingresar</a>
  </div>

  <div class="navbar-toggle" onclick="toggleMenu()">☰</div>
</nav>
`;

// Insertar al cargar
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
  }
});

// Loader
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

// Crear sección de productos
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

// Cargar CSV
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

document.addEventListener("DOMContentLoaded", cargarEventos);
