async function cargarEvento() {
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";

  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) loadingDiv.style.display = "flex";

  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const eventos = result.data;

    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get("id");
    const evento = eventos.find(
      e => e.nombre.toLowerCase().replaceAll(" ", "-") === eventoId
    );

    const contenedorEvento = document.getElementById("evento");
    const imagen = document.getElementById("imagen");
    const selectFechas = document.querySelector(".event-dates");
    const card = document.querySelector(".event-card");
    const botonComprar = document.querySelector(".event-button");

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
        <h3 style="margin-top:6.5rem; color:#6200EA;">
          ¡No pudimos encontrar el evento!
        </h3>
      `;
      card.style.display = "none";
      return;
    }

    document.title = evento.nombre;
    imagen.src = evento.img;
    if (evento.estado) contenedorEvento.querySelector("#estado").textContent = evento.estado;

    /* ========= DOC (SOLO TEXTO) ========= */
    if (evento.doc_id) {
      cargarGoogleDoc(evento.doc_id);
    }

    /* ========= MAPA DESDE SHEETS ========= */
    if (evento.mapa_img) {
      const mapContainer = document.querySelector(".event-doc-map");
      if (mapContainer) {
        mapContainer.innerHTML = `
          <img 
            src="${evento.mapa_img}" 
            alt="Mapa del evento"
            style="width:100%; height:auto;"
          >
        `;
      }
    }

    /* ========= FECHAS ========= */
    if (evento.fechas) {
      selectFechas.innerHTML = "";
      evento.fechas.split(";").forEach(fecha => {
        const option = document.createElement("option");
        option.textContent = fecha.trim();
        selectFechas.appendChild(option);
      });
    }

    /* ========= SECTORES / TARIFAS ========= */
    const sectores = evento.sectores ? evento.sectores.split(";") : [];
    const tarifas = evento.tarifas ? evento.tarifas.split(";") : [];

    function actualizarTarifaCantidad() {
      selectTarifas.innerHTML = "";
      selectCantidad.innerHTML = "";

      const index = selectSectores.selectedIndex;
      if (index >= 0) {
        const tarifa = tarifas[index] || "0";

        selectTarifas.innerHTML = `<option>$${tarifa}</option>`;

        for (let i = 1; i <= 4; i++) {
          selectCantidad.innerHTML += `<option>${i}</option>`;
        }
      }
    }

    selectSectores.innerHTML = "";
    sectores.forEach(sec => {
      selectSectores.innerHTML += `<option>${sec}</option>`;
    });

    selectSectores.addEventListener("change", actualizarTarifaCantidad);
    if (sectores.length) actualizarTarifaCantidad();

    /* ========= AGOTADO ========= */
    if (evento.agotado?.toUpperCase() === "TRUE") {
      [selectSectores, selectTarifas, selectCantidad, selectFechas, botonComprar]
        .forEach(el => el.style.display = "none");

      const divAgotado = document.createElement("div");
      divAgotado.textContent = "AGOTADO";
      divAgotado.style.cssText = `
        width:100%;
        padding:1rem;
        text-align:center;
        font-weight:bold;
        background:#6200EA;
        color:#fff;
        margin-bottom:1rem;
      `;
      card.insertBefore(divAgotado, card.firstChild);
    }

  } catch (err) {
    console.error("Error cargando CSV:", err);
  } finally {
    if (loadingDiv) loadingDiv.style.display = "none";
  }
}

/* ========= GOOGLE DOC (SOLO TEXTO) ========= */
function cargarGoogleDoc(docId) {
  const textContainer = document.querySelector(".event-doc-text");
  if (!textContainer) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://docs.google.com/document/d/e/${docId}/pub?embedded=true`;
  iframe.style.width = "100%";
  iframe.style.minHeight = "1100px";
  iframe.style.border = "none";

  textContainer.innerHTML = "";
  textContainer.appendChild(iframe);
}

cargarEvento();
