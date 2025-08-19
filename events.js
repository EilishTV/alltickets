async function cargarEvento() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";
  const response = await fetch(SHEET_CSV_URL);
  const data = await response.text();

  const filas = data.split("\n").map(f => f.split(","));
  const headers = filas[0].map(h => h.trim());
  const eventos = filas.slice(1).map(fila => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = fila[i] ? fila[i].trim() : "";
    });
    return obj;
  });

  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("id");

  const evento = eventos.find(e =>
    e.nombre.toLowerCase().replaceAll(" ", "-") === eventoId
  );

  const contenedorEvento = document.getElementById("evento");
  const imagen = document.getElementById("imagen");
  const selectFechas = document.querySelector(".event-dates");
  const selectEntradas = document.querySelector(".entrada-tipos");
  const botonComprar = document.querySelector(".event-button");

  if (!evento) {
    contenedorEvento.innerHTML = "<h2>⚠️ Evento no encontrado</h2>";
    return;
  }

  document.title = evento.nombre;
  imagen.src = evento.img;

  // Manejo de fechas (pueden estar separadas por ;)
  if (evento.fechas) {
    selectFechas.innerHTML = "";
    evento.fechas.split(";").forEach((fecha, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = fecha.trim();
      selectFechas.appendChild(option);
    });
  }

  // Manejo de entradas (columna JSON)
  try {
    const entradas = JSON.parse(evento.entradas);
    selectEntradas.innerHTML = "";
    entradas.forEach((entrada, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = entrada.nombre + (entrada.agotado ? " (Agotado)" : ` - $${entrada.precio}`);
      option.disabled = entrada.agotado;
      selectEntradas.appendChild(option);
    });

    // Actualizar botón
    selectEntradas.addEventListener("change", () => {
      const entradaSeleccionada = entradas[selectEntradas.value];
      if (!entradaSeleccionada || entradaSeleccionada.agotado) {
        botonComprar.textContent = "Agotado";
        botonComprar.href = "#";
        return;
      }
      botonComprar.textContent = "Comprar";
      botonComprar.href = entradaSeleccionada.linkPago;
      botonComprar.target = "_blank";
    });

  } catch (e) {
    console.error("Error parseando entradas", e);
  }
}

cargarEvento();


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

