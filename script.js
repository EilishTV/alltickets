
function crearSeccionProductos(titulo, productos) {
  const containerGeneral = document.getElementById('productos-container');

  // Crear contenedor de la sección
  const seccion = document.createElement('div');
  seccion.classList.add('productos-section');

  // Título
  if (titulo && titulo.trim() !== "") {
    const h2 = document.createElement('h2');
    h2.classList.add('section-title');
    h2.textContent = titulo;
    seccion.appendChild(h2);
  }

  // Contenedor de productos
  const contenedorProductos = document.createElement('div');
  contenedorProductos.classList.add('productos-container');

  // Recorrer productos
  productos.forEach(({ img, nombre, lugar, precio, agotado }) => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');

    // Crear ID para el evento desde el nombre
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

    // Agregamos clase img-zoom solo si no está agotado
    const claseZoom = !agotado ? 'img-zoom' : '';

    productoDiv.innerHTML = `
      <a href="events.html?id=${idEvento}" class="producto-link">
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

// ======================
// Sección: Events
// ======================
async function cargarEventos() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();

    // Parsear CSV con PapaParse
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const eventos = result.data;

    // Adaptar a formato de productos
    const productos = eventos.map(e => ({
      img: e.img,
      nombre: e.nombre,
      lugar: e.lugar,
      precio: e.precio,  // nueva columna precio
      agotado: (e.agotado || "").toUpperCase() === "TRUE"
    }));

    crearSeccionProductos("", productos);

  } catch (err) {
    console.error("Error cargando CSV:", err);
  }
}

cargarEventos();

