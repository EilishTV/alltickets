let eventos = {};

// Link CSV de tu Google Sheets (reemplazá si cambias la hoja)
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScGKiobh0rcWmX0DCaQ5e7Dl-LG5NkEzke89369jQf94yHCuiSfYEZNZ33ULywHY7xb0HQO5T7OMpt/pub?output=csv";

// Función para parsear CSV a JSON
function parseCSV(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const data = {};

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    // Maneja comas dentro de comillas
    const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j].replace(/^"|"$/g, "");
    }
    // Convertimos fechas y entradas de string JSON a objetos
    obj.fechas = obj.fechas ? JSON.parse(obj.fechas) : [];
    obj.entradas = obj.entradas ? JSON.parse(obj.entradas) : [];
    data[obj.id] = obj;
  }
  return data;
}

// Cargar eventos desde Google Sheets
fetch(SHEET_CSV_URL)
  .then(res => res.text())
  .then(csv => {
    eventos = parseCSV(csv);
    document.dispatchEvent(new Event("eventosCargados"));
  })
  .catch(err => console.error("Error cargando eventos:", err));

document.addEventListener("DOMContentLoaded", () => {
  // Esperamos que los eventos se carguen
  if (Object.keys(eventos).length === 0) {
    document.addEventListener("eventosCargados", initEvento);
  } else {
    initEvento();
  }
});

function initEvento() {
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
  if (evento.entradas && evento.entradas.length > 0) {
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

    botonComprar.href = entradaSeleccionada.linkPago;
    botonComprar.target = "_blank";
    botonComprar.textContent = "Comprar";
    botonComprar.classList.remove("agotado");
    botonComprar.style.pointerEvents = "auto";
  }

  if (selectFechas.options.length > 0) selectFechas.selectedIndex = 0;
  if (selectEntradas.options.length > 0) selectEntradas.selectedIndex = 0;
  actualizarBoton();

  selectFechas.addEventListener("change", actualizarBoton);
  selectEntradas.addEventListener("change", actualizarBoton);

  console.log("Fechas disponibles:", evento.fechas);
}

