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
      <a href="events.html?id=${idEvento}">
        <div class="imagen-contenedor">
          ${agotado ? '<div class="agotado-label">Sold Out</div>' : ''}
          <img src="${img}" alt="${nombre}" class="${claseZoom}">
        </div>
        <div class="producto-nombre">${nombre}</div>
        <div class="producto-precio">${lugar}</div>
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

const Events = [
  {
    img: "https://cdn.getcrowder.com/images/ac426427-501b-456c-b8e7-9a1293c71927-1920x720-aa-1.jpg",
    nombre: "Damiano David",
    lugar: "C. Art Media",
    agotado: true
  },
  {
    img: "https://cdn.getcrowder.com/images/4d3f9d66-c328-4f47-9d1e-288c10f5977a-aa-banner-1920x720.jpg",
    nombre: "Lola Indigo",
    lugar: "C. Art Media",
    agotado: false
  },
    {
    img: "https://i.postimg.cc/rsNPRfcK/wildflowerfest-banner.png",
    nombre: "Wildflower Fest",
    lugar: "The Roxy Live",
    agotado: false
  },
];

crearSeccionProductos("", Events);
