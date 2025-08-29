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
  productos.forEach(({ img, nombre, lugar, agotado }) => {
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
    <div class="producto-precio"><span class="sin-subrayado">${lugar}</span></div>
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
  const response = await fetch(SHEET_CSV_URL);
  const data = await response.text();

  // Parsear CSV en objetos
  const filas = data.split("\n").map(f => f.split(","));
  const headers = filas[0].map(h => h.trim());
  const eventos = filas.slice(1).map(fila => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = fila[i] ? fila[i].trim() : "";
    });
    return obj;
  });

  // Adaptar a formato de productos
  const productos = eventos.map(e => ({
    img: e.img,
    nombre: e.nombre,
    lugar: e.lugar,
    agotado: e.agotado.toUpperCase() === "TRUE"
  }));

  crearSeccionProductos("", productos);
}

cargarEventos();

