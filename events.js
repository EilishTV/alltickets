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
    const csvText = await response.text();

    // Parsear CSV con PapaParse
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const eventos = result.data;

const params = new URLSearchParams(window.location.search);
const eventoId = params.get("id");

// Buscar el evento según el nombre formateado
const evento = eventos.find(e =>
  e.nombre.toLowerCase().replaceAll(" ", "-") === eventoId
);

const contenedorEvento = document.getElementById("evento");
const imagen = document.getElementById("imagen");
const selectFechas = document.querySelector(".event-dates");
const selectEntradas = document.querySelector(".entrada-tipos");
const botonComprar = document.querySelector(".event-button");
const card = document.querySelector(".event-card");

  if (!evento) {
    contenedorEvento.innerHTML = "<h3 style='margin-top:6.5rem; color:#6200EA;font-weight: normal;'>¡No pudimos encontrar el evento!</h2>";

  // Agregar mensaje de caducidad debajo del estado
  const mensajeCaducidad = document.createElement("p");
  mensajeCaducidad.textContent = "El evento que buscás no existe o ya no está vigente.";
  mensajeCaducidad.style.color = "grey";
  mensajeCaducidad.style.marginTop = "0px";
  mensajeCaducidad.style.fontSize = "1.0rem"; // achica el texto
  contenedorEvento.appendChild(mensajeCaducidad);


  // 👇 Ocultar la tarjeta si el evento no existe
  if (card) {
    card.style.display = "none";
  }
  return;
}

// ======================
// Si el evento existe
// ======================
imagen.src = evento.img;

if (evento.estado) contenedorEvento.querySelector("#estado").textContent = evento.estado;


// Cargar fechas en el select
if (evento.fechas && Array.isArray(evento.fechas)) {
  evento.fechas.forEach(fecha => {
    const option = document.createElement("option");
    option.textContent = fecha;
    selectFechas.appendChild(option);
  });
}

// Cargar tipos de entradas en el select
if (evento.entradas && Array.isArray(evento.entradas)) {
  evento.entradas.forEach(tipo => {
    const option = document.createElement("option");
    option.textContent = tipo;
    selectEntradas.appendChild(option);
  });
}

// Configurar botón comprar (opcional, depende de tu data)
if (evento.link) {
  botonComprar.href = evento.link;
}


    // Título e imagen
    document.title = evento.nombre;
    imagen.src = evento.img;

    // Manejo de fechas (separadas por ;)
    if (evento.fechas) {
      selectFechas.innerHTML = "";
      evento.fechas.split(";").forEach((fecha, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = fecha.trim();
        selectFechas.appendChild(option);
      });
    }

    // Manejo de entradas (JSON dentro de la celda)
    let entradas = [];
    try {
      // Con PapaParse, la celda llega limpia, solo parseamos
      entradas = JSON.parse(evento.entradas);

      selectEntradas.innerHTML = "";
      entradas.forEach((entrada, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = entrada.nombre + (entrada.agotado ? " (Agotado)" : ` - $${entrada.precio}`);
        option.disabled = entrada.agotado;
        selectEntradas.appendChild(option);
      });

      // Listener al cambiar de entrada
      selectEntradas.addEventListener("change", () => {
        const entradaSeleccionada = entradas[selectEntradas.value];
        if (!entradaSeleccionada || entradaSeleccionada.agotado) {
          botonComprar.textContent = "Agotado";
          botonComprar.href = "#";
          botonComprar.classList.add("agotado");
          botonComprar.style.pointerEvents = "none";
          return;
        }
        botonComprar.textContent = "Comprar";
        botonComprar.href = entradaSeleccionada.linkPago;
        botonComprar.target = "_blank";
        botonComprar.classList.remove("agotado");
        botonComprar.style.pointerEvents = "auto";
      });

      // Inicializar botón en la primera entrada válida
      if (entradas.length > 0) {
        selectEntradas.selectedIndex = 0;
        selectEntradas.dispatchEvent(new Event("change"));
      }

    } catch (e) {
      console.error("Error parseando entradas:", e, evento.entradas);
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
