// URL del CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";

// Función para obtener los eventos y generar el id
async function fetchEvents() {
  const response = await fetch(csvUrl);
  const data = await response.text();

  const rows = data.split("\n").map(r => r.split(","));
  const headers = rows.shift().map(h => h.trim());

  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]?.trim() || "");

    // Crear un idEvento a partir del nombre
    obj.idEvento = obj.nombre
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return obj;
  });
}

function createSlider(events) {
  const slider = document.getElementById("slider");
  slider.style.position = "relative";
  slider.style.overflow = "hidden";
  slider.style.width = "100%";
  slider.style.aspectRatio = "1920/720"; // Proporción exacta 1920x720
  slider.style.marginTop = "80px";
  slider.style.borderRadius = "12px";
  slider.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

  const track = document.createElement("div");
  track.style.display = "flex";
  track.style.transition = "transform 0.6s ease";
  track.style.height = "100%";

  events.forEach(event => {
    const slide = document.createElement("div");
    slide.style.minWidth = "100%";
    slide.style.height = "100%";
    slide.style.position = "relative";
    slide.style.backgroundImage = `url(${event.img})`;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";

    // Degradado sombra
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0))";
    overlay.style.borderRadius = "12px";

    // Texto / datos responsive
    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.bottom = "5%";
    info.style.left = "5%";
    info.style.color = "white";
    info.style.fontFamily = "Arial, sans-serif";
    info.innerHTML = `
      <a href="events.html?id=${event.idEvento}" style="text-decoration:none; color:white;">
        <h2 style="font-size:2vw; margin:0;">${event.nombre}</h2>
      </a>
      <p style="margin:0.5em 0; font-size:1vw;">${event.lugar}</p>
      <a href="events.html?id=${event.idEvento}" style="
        display:inline-block;
        margin-top:1em;
        background:#fff;
        color:#000;
        padding:0.5em 1em;
        border-radius:0.5em;
        font-weight:bold;
        text-decoration:none;
        transition:0.3s;
      " onmouseover="this.style.background='#ddd'" onmouseout="this.style.background='#fff'">
        Comprar
      </a>
    `;

    slide.appendChild(overlay);
    slide.appendChild(info);
    track.appendChild(slide);
  });

  slider.appendChild(track);

  // Navegación automática
  let index = 0;
  setInterval(() => {
    index = (index + 1) % events.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 5000);
}

// Inicializar
fetchEvents().then(createSlider);
