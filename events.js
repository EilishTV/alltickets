const loadingDiv = document.createElement('div');
loadingDiv.id = 'loading';
loadingDiv.style.cssText = `
  position: fixed; top:0; left:0;
  width:100%; height:100%;
  background-color:#f9f9f8;
  display:flex; justify-content:center; align-items:center;
  z-index:998;
`;
const spinner = document.createElement('div');
spinner.style.cssText = `
  border:6px solid #f3f3f3;
  border-top:6px solid #6200EA;
  border-radius:50%;
  width:30px; height:30px;
  animation:spin 1s linear infinite;
`;
loadingDiv.appendChild(spinner);
document.body.appendChild(loadingDiv);

const style = document.createElement('style');
style.textContent = `
@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
`;
document.head.appendChild(style);

async function cargarEvento() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";

  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const eventos = result.data;

    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get("id");
    const evento = eventos.find(e =>
      e.nombre.toLowerCase().replaceAll(" ", "-") === eventoId
    );

    const contenedorEvento = document.getElementById("evento");
    const imagen = document.getElementById("imagen");
    const selectFechas = document.querySelector(".event-dates");
    const card = document.querySelector(".event-card");
    const botonComprar = document.querySelector(".event-button");

    // Crear selects dinámicos
    const selectSectores = document.createElement("select");
    selectSectores.classList.add("event-sector");
    const selectTarifas = document.createElement("select");
    selectTarifas.classList.add("event-tarifa");
    const selectCantidad = document.createElement("select");
    selectCantidad.classList.add("event-cantidad");
    card.insertBefore(selectSectores, botonComprar);
    card.insertBefore(selectTarifas, botonComprar);
    card.insertBefore(selectCantidad, botonComprar);

    if (!evento) {
      contenedorEvento.innerHTML = `
        <h3 style="margin-top:6.5rem; color:#6200EA; font-weight:normal;">
          ¡No pudimos encontrar el evento!
        </h3>
        <p style="margin-top:1rem; color:#333;">
          Posiblemente este ya finalizó o nunca existió.
        </p>
      `;
      if (card) card.style.display = "none";
      return;
    }

    document.title = evento.nombre;
    imagen.src = evento.img;
    if (evento.estado) contenedorEvento.querySelector("#estado").textContent = evento.estado;

    // Fechas
    if (evento.fechas) {
      selectFechas.innerHTML = "";
      evento.fechas.split(";").forEach(fecha => {
        const option = document.createElement("option");
        option.textContent = fecha.trim();
        selectFechas.appendChild(option);
      });
    }

    // Sectores y tarifas
    const sectores = evento.sectores ? evento.sectores.split(";") : [];
    const tarifas = evento.tarifas ? evento.tarifas.split(";") : [];
    const cantidades = evento.cantidad ? evento.cantidad.split(";") : [];

    function actualizarTarifaCantidad() {
      selectTarifas.innerHTML = "";
      selectCantidad.innerHTML = "";
      const index = selectSectores.selectedIndex;
      if (index >= 0) {
        const tarifa = tarifas[index] || "0";

        const optionTarifa = document.createElement("option");
        optionTarifa.value = tarifa;
        optionTarifa.textContent = `$${tarifa}`;
        selectTarifas.appendChild(optionTarifa);

        // Cantidad fija hasta 4
        for (let i = 1; i <= 4; i++) {
          const optionCantidad = document.createElement("option");
          optionCantidad.value = i;
          optionCantidad.textContent = i;
          selectCantidad.appendChild(optionCantidad);
        }
      }
    }

    selectSectores.innerHTML = "";
    sectores.forEach(sec => {
      const option = document.createElement("option");
      option.textContent = sec;
      selectSectores.appendChild(option);
    });
    selectSectores.addEventListener("change", actualizarTarifaCantidad);
    if (sectores.length > 0) {
      selectSectores.selectedIndex = 0;
      actualizarTarifaCantidad();
    }

    // Verificar si el evento está agotado
    if (evento.agotado && evento.agotado.toUpperCase() === "TRUE") {
      // Ocultar selects y botón
      selectSectores.style.display = "none";
      selectTarifas.style.display = "none";
      selectCantidad.style.display = "none";
      selectFechas.style.display = "none";
      botonComprar.style.display = "none";

      // Crear div AGOTADO
      const divAgotado = document.createElement("div");                                                                 
      divAgotado.textContent = "AGOTADO";
      divAgotado.style.width = "100%";
      divAgotado.style.padding = "1rem";
      divAgotado.style.textAlign = "center";
      divAgotado.style.fontWeight = "bold";
      divAgotado.style.backgroundColor = "#6200EA";
      divAgotado.style.color = "#fff";
      divAgotado.style.border = "1px solid #CCCCCC";
      divAgotado.style.boxSizing = "border-box";
      divAgotado.style.display = "block";
      divAgotado.style.margin = "0 0 1rem 0";

      // Insertar AGOTADO al inicio del card
      card.insertBefore(divAgotado, card.firstChild);
    } else {
      // Entradas (solo si no está agotado)
      let entradas = [];
      try {
        entradas = JSON.parse(evento.entradas || "[]");
        const selectEntradas = document.querySelector(".entrada-tipos");
        selectEntradas.innerHTML = "";
        entradas.forEach((entrada, i) => {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = `${entrada.nombre} - $${entrada.precio}`;
          if (entrada.agotado) {
            option.textContent += " (Agotado)";
            option.disabled = true;
          }
          selectEntradas.appendChild(option);
        });

        selectEntradas.addEventListener("change", () => {
          const entradaSel = entradas[selectEntradas.value];
          if (!entradaSel || entradaSel.agotado) {
            botonComprar.textContent = "Agotado";
            botonComprar.href = "#";
            botonComprar.classList.add("agotado");
            botonComprar.style.pointerEvents = "none";
            return;
          }
          botonComprar.textContent = "Comprar";
          botonComprar.href = entradaSel.linkPago;
          botonComprar.target = "_blank";
          botonComprar.classList.remove("agotado");
          botonComprar.style.pointerEvents = "auto";
        });

        if (entradas.length > 0) {
          selectEntradas.selectedIndex = 0;
          selectEntradas.dispatchEvent(new Event("change"));
        }
      } catch (err) {
        console.error("Error parseando entradas:", err);
      }
    }

  } catch (err) {
    console.error("Error cargando CSV:", err);
  } finally {
    loadingDiv.style.display = "none";
  }
}

cargarEvento();