// Crear overlay de carga
const loadingDiv = document.createElement('div');
loadingDiv.id = 'loading';
loadingDiv.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: #f9f9f8;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
`;

// Crear spinner
const spinner = document.createElement('div');
spinner.style.cssText = `
  border: 6px solid #f3f3f3;
  border-top: 6px solid #6200EA;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
`;
loadingDiv.appendChild(spinner);

// Agregar al body
document.body.appendChild(loadingDiv);

// Crear keyframes de spin desde JS
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// Función principal
async function cargarEvento() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";
  
  try {
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

    // Manejo de fechas
    if (evento.fechas) {
      selectFechas.innerHTML = "";
      evento.fechas.split(";").forEach((fecha, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = fecha.trim();
        selectFechas.appendChild(option);
      });
    }

    // Manejo de entradas
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

  } catch (error) {
    console.error("Error al cargar los eventos:", error);
  } finally {
    // Ocultar overlay cuando termine
    loadingDiv.style.display = 'none';
  }
}

// Ejecutar
cargarEvento();
