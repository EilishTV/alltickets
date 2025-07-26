const eventos = {
  "damiano-david": {
    nombre: "Damiano David",
    img: "https://cdn.getcrowder.com/images/ac426427-501b-456c-b8e7-9a1293c71927-1920x720-aa-1.jpg",
    lugar: "C. Art Media",
    fechas: ["11/12/2025 20:00"],
    agotado: false
  },
  "lola-indigo": {
    nombre: "Lola Indigo",
    img: "https://cdn.getcrowder.com/images/4d3f9d66-c328-4f47-9d1e-288c10f5977a-aa-banner-1920x720.jpg",
    lugar: "C. Art Media",
    fechas: ["2/10/2025 20:00"],
  }
};

// events.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("id");
  const evento = eventos[eventoId];

  const contenedorEvento = document.getElementById("evento");
  const imagen = document.getElementById("imagen");
  const select = document.querySelector(".event-dates");
  const button = document.querySelector(".event-button");
  const card = document.querySelector(".event-card");

  if (!evento) {
    // Mostrar mensaje de error
    contenedorEvento.innerHTML = `
      <h2>⚠️ Evento no encontrado</h2>
      <p>El evento que estás buscando no existe o fue eliminado.</p>
      <a href="index.html">Volver al inicio</a>
    `;
    if (card) card.style.display = "none";
    document.title = "404 - ID Not Found";
    return;
  }

  // Título dinámico
  if (evento.nombre) {
    document.title = evento.nombre;
  }

  // Imagen
  if (imagen && evento.img) {
    imagen.src = evento.img;
    imagen.alt = evento.nombre;
  }

  // Fechas
  if (select && evento.fechas && evento.fechas.length > 0) {
    evento.fechas.forEach(fecha => {
      const option = document.createElement("option");
      option.textContent = fecha;
      select.appendChild(option);
    });
    select.style.display = "block";
  } else if (select) {
    select.style.display = "none";
  }

  // Botón
  if (button) {
    if (evento.agotado) {
      button.textContent = "Agotado";
      button.href = "#";
      button.classList.add("agotado");
    } else {
      button.href = evento.link || "#";
    }
  }
});
