// -----------------------------
// 📌 Loader
// -----------------------------
function crearLoader() {
  // Crear el contenedor del loader
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = `
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:#f9f9f8;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999;
  `;

  // Spinner
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border:6px solid #f3f3f3;
    border-top:6px solid #6200EA;
    border-radius:50%;
    width:30px;
    height:30px;
    animation:spin 1s linear infinite;
  `;
  loadingDiv.appendChild(spinner);
  document.body.appendChild(loadingDiv);

  // Animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
  `;
  document.head.appendChild(style);
}

// Función para remover loader
function removerLoader() {
  const loader = document.getElementById('loading');
  if(loader) loader.remove();
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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const claseZoom = !agotado ? 'img-zoom' : '';

    productoDiv.innerHTML = `
      <a href="pages/events/?id=${idEvento}" class="producto-link">
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
// 📌 Signup (localStorage temporal)
// -----------------------------
const signupForm = document.querySelector("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupForm.querySelector("#email").value.trim();
    const password = signupForm.querySelector("#password").value.trim();
    const confirm = signupForm.querySelector("#confirm-password").value.trim();
    const firstName = signupForm.querySelector("#first-name").value.trim();
    const lastName = signupForm.querySelector("#last-name").value.trim();

    if (!email || !password || !confirm || !firstName || !lastName) return alert("Completá todos los campos");
    if (password !== confirm) return alert("Passwords do not match");

    const usuarioData = { firstName, lastName, email };
    localStorage.setItem("usuario_" + email, JSON.stringify(usuarioData));
    localStorage.setItem("usuario_email", email);

    alert("Cuenta creada correctamente. Ya estás logueado.");
    window.location.href = "/index.html";
  });
}

// -----------------------------
// 📌 Inicializar todo al cargar
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  crearLoader();
  cargarEventos();
});

// Poner el link completo como título
function setTitleAsLink() {
  const fullLink = window.location.origin + window.location.pathname; 
  document.title = fullLink;
}

window.addEventListener("DOMContentLoaded", setTitleAsLink);
