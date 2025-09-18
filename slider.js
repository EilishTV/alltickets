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

  // 📏 ALTURA DEL SLIDER:
  slider.style.aspectRatio = "1920/720"; // proporción exacta
  // 👉 si preferís altura fija, podés usar en su lugar:
  // slider.style.height = "400px"; // cambia el valor a gusto

  slider.style.marginTop = "80px";
  slider.style.borderRadius = "12px";
  slider.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

  const track = document.createElement("div");
  track.style.display = "flex";
  track.style.transition = "transform 1.0s ease";
  track.style.height = "100%";

  // Clonamos primera y última para infinito
  const extendedEvents = [events[events.length - 1], ...events, events[0]];

  extendedEvents.forEach(event => {
    const slide = document.createElement("div");
    slide.style.minWidth = "100%";
    slide.style.height = "100%";
    slide.style.position = "relative";
    slide.style.backgroundImage = `url(${event.img})`;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0))";
    overlay.style.borderRadius = "12px";

    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.bottom = "7%";
    info.style.left = "3%";
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

  // 🔘 Indicadores (puntitos) - ahora abajo de la imagen
  const indicators = document.createElement("div");
  indicators.style.position = "relative";
  indicators.style.marginTop = "20px"; // 📏 separación vertical entre slider y puntitos
  indicators.style.display = "flex";
  indicators.style.justifyContent = "right"; // centrados
  indicators.style.gap = "8px";

  const dots = events.map((_, i) => {
    const dot = document.createElement("div");
    dot.style.width = "12px";
    dot.style.height = "12px";
    dot.style.borderRadius = "50%";
    dot.style.background = i === 0 ? "black" : "gray";
    indicators.appendChild(dot);
    return dot;
  });

  // Los puntitos van después del slider
  slider.insertAdjacentElement("afterend", indicators);

  // -------------------------
  // Navegación automática + infinita
  // -------------------------
  let index = 1; // arrancamos en el primer slide "real"
  track.style.transform = `translateX(-${index * 100}%)`;

  function updateDots(realIndex) {
    dots.forEach((dot, i) => {
      dot.style.background = i === realIndex ? "black" : "gray";
    });
  }

  function goToSlide(newIndex) {
    index = newIndex;
    track.style.transition = "transform 1s ease";
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  track.addEventListener("transitionend", () => {
    if (index === 0) {
      track.style.transition = "none";
      index = events.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    if (index === events.length + 1) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    updateDots(index - 1);
  });

  // ⏱️ Tiempo de cada foto (CAMBIÁ ESTE VALOR)
  const intervalTime = 7000; // 1000 = 1 segundo/s

  setInterval(() => {
    goToSlide(index + 1);
  }, intervalTime);

  // -------------------------
  // Arrastre con mouse / touch
  // -------------------------
  let startX = 0;
  let isDragging = false;

  slider.addEventListener("mousedown", e => {
    startX = e.pageX;
    isDragging = true;
  });

  slider.addEventListener("mouseup", e => {
    if (!isDragging) return;
    let diff = e.pageX - startX;
    if (diff > 50) goToSlide(index - 1);
    else if (diff < -50) goToSlide(index + 1);
    isDragging = false;
  });

  slider.addEventListener("mouseleave", () => { isDragging = false; });

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  slider.addEventListener("touchend", e => {
    if (!isDragging) return;
    let diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) goToSlide(index - 1);
    else if (diff < -50) goToSlide(index + 1);
    isDragging = false;
  });
}

// Inicializar
fetchEvents().then(createSlider);
