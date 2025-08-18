
const eventos = {
  "damiano-david": {
    nombre: "Damiano David",
    img: "https://cdn.getcrowder.com/images/ac426427-501b-456c-b8e7-9a1293c71927-1920x720-aa-1.jpg",
    lugar: "C. Art Media",
    fechas: ["11/12/2025 21:00"],
    entradas: [
      {
        nombre: "General Preventa 4",
        precio: 85000,
        agotado: true,
        linkPago: "mercadopago.com"
      },
      {
        nombre: "Preventa 1",
        precio: 50000,
        agotado: true,
        linkPago: "mercadopago.com"
      },
      {
        nombre: "Preventa 2",
        precio: 60000,
        agotado: true,
        linkPago: "mercadopago.com"
      },
      {
        nombre: "Preventa 3",
        precio: 72000,
        agotado: true,
        linkPago: "mercadopago.com"
      },
    ]
  },
  "lola-indigo": {
    nombre: "Lola Indigo",
    img: "https://cdn.getcrowder.com/images/4d3f9d66-c328-4f47-9d1e-288c10f5977a-aa-banner-1920x720.jpg",
    lugar: "C. Art Media",
    fechas: "",
    entradas: [
      {
        nombre: "General",
        precio: 2500,
        agotado: false,
        linkPago: "https://www.mercadopago.com.ar/link-general-lola"
      },
      {
        nombre: "VIP",
        precio: 5500,
        agotado: false,
        linkPago: "https://www.mercadopago.com.ar/link-vip-lola"
      }
    ]
  },
  "maria-becerra": {
    nombre: "Maria Becerra",
    img: "https://cdn.getcrowder.com/images/4458ebd9-942e-45ec-b302-9e45e21148e8-mb-1312-banneraa-1920x720.jpg?w=1920&format=webp",
    lugar: "Estadio River Plate",
    fechas: ["13/12/25 21:00"],
    entradas: [
      {
        nombre: "Campo Sivori",
        precio: 65000,
        agotado: false,
        linkPago: "https://www.mercadopago.com.ar/link-general-wildflower"
      },
      {
        nombre: "Campo Centario",
        precio: 65000,
        agotado: false,
        linkPago: "https://www.mercadopago.com.ar/link-campo-wildflower"
      }
    ]
  }
};

// events.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("id");
  const evento = eventos[eventoId];

  const contenedorEvento = document.getElementById("evento");
  const imagen = document.getElementById("imagen");
  const selectFechas = document.querySelector(".event-dates");
  const selectEntradas = document.querySelector(".entrada-tipos");
  const botonComprar = document.querySelector(".event-button");
  const card = document.querySelector(".event-card");

  if (!evento) {
    contenedorEvento.innerHTML = `
      <h2>⚠️ Evento no encontrado</h2>
      <p>El evento que estás buscando no existe o fue eliminado.</p>
      <a href="index.html">Volver al inicio</a>
    `;
    if (card) card.style.display = "none";
    document.title = "404 - ID Not Found";
    return;
  }

  document.title = evento.nombre || "Evento";

  if (imagen && evento.img) {
    imagen.src = evento.img;
    imagen.alt = evento.nombre;
  }

  // Cargamos fechas
  if (evento.fechas && evento.fechas.length > 0) {
    selectFechas.innerHTML = "";
    evento.fechas.forEach((fecha, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = fecha;
      selectFechas.appendChild(option);
    });
    selectFechas.style.display = "inline-block";
  } else {
    selectFechas.style.display = "none";
  }

  // Cargamos entradas
  if(evento.entradas && evento.entradas.length > 0) {
    selectEntradas.innerHTML = "";
    evento.entradas.forEach((entrada, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = entrada.nombre + (entrada.agotado ? " (Agotado)" : ` - $${entrada.precio}`);
      option.disabled = entrada.agotado;
      selectEntradas.appendChild(option);
    });
    selectEntradas.style.display = "inline-block";
  } else {
    selectEntradas.style.display = "none";
  }

  function actualizarBoton() {
    const idxEntrada = selectEntradas.value;
    const idxFecha = selectFechas.value;

    if (idxEntrada === null || idxEntrada === undefined || idxEntrada === "") {
      botonComprar.href = "#";
      botonComprar.textContent = "Selecciona entrada";
      botonComprar.classList.add("agotado");
      botonComprar.style.pointerEvents = "none";
      return;
    }

    const entradaSeleccionada = evento.entradas[idxEntrada];
    if (!entradaSeleccionada || entradaSeleccionada.agotado) {
      botonComprar.href = "#";
      botonComprar.textContent = "Agotado";
      botonComprar.classList.add("agotado");
      botonComprar.style.pointerEvents = "none";
      return;
    }

    // Acá podrías combinar fecha + entrada para decidir link
    // Pero para simplificar, linkPago solo depende de la entrada
    botonComprar.href = entradaSeleccionada.linkPago;
    botonComprar.target = "_blank";
    botonComprar.textContent = "Comprar";
    botonComprar.classList.remove("agotado");
    botonComprar.style.pointerEvents = "auto";
  }

  // Inicializo selects y botón
  if(selectFechas.options.length > 0) selectFechas.selectedIndex = 0;
  if(selectEntradas.options.length > 0) selectEntradas.selectedIndex = 0;
  actualizarBoton();

  // Actualizo botón al cambiar cualquiera de los selects
  selectFechas.addEventListener("change", actualizarBoton);
  selectEntradas.addEventListener("change", actualizarBoton);
});

console.log("Fechas disponibles:", evento.fechas);

