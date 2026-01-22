document.addEventListener("DOMContentLoaded", async () => {
  try {
    // =============================
    // BASE PATH
    // =============================
    let path = window.location.pathname.split("/").filter(Boolean);
    let depth =
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? path.length - 1
        : path.length - 2;

    let basePath = "../".repeat(Math.max(depth, 0));

    // =============================
    // CSV
    // =============================
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/1WZnQmVeQGM1JnSzF_6Cq3ZOHaJf70lJtfHnyZIjLpjI/export?format=csv";

    const res = await fetch(csvUrl);
    const text = await res.text();
    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows.shift();

    const events = rows.map(row => {
      let e = {};
      headers.forEach((h, i) => (e[h.trim()] = row[i]?.trim() || ""));
      e.idEvento = e.nombre
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return e;
    });

    const slider = document.getElementById("slider");
    if (!slider) return;

    // =============================
    // STYLES
    // =============================
    const style = document.createElement("style");
    style.textContent = `
      #slider {
        margin-top: 6rem;
        padding: 0 16px;
      }

      /* ===== DESKTOP ===== */
      .desktop-slider {
        display: none;
        aspect-ratio: 1920 / 720;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 20px 55px rgba(0,0,0,.45);
      }

      .desktop-track {
        display: flex;
        height: 100%;
        transition: transform .9s ease;
      }

      .desktop-slide {
        min-width: 100%;
        position: relative;
      }

      .desktop-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .desktop-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to right,
          rgba(0,0,0,.7),
          rgba(0,0,0,.35),
          rgba(0,0,0,0)
        );
      }

      .desktop-info {
        position: absolute;
        bottom: 14%;
        left: 5%;
        max-width: 520px;
        color: white;
        font-family: system-ui;
      }

      .desktop-info h2 {
        margin: 0 0 12px;
        font-size: clamp(28px, 3vw, 46px);
        line-height: 1.1;
      }

      .desktop-info p {
        margin: 0 0 22px;
        font-size: clamp(15px, 1.3vw, 19px);
        opacity: .85;
      }

      .buy-btn {
        display: inline-block;
        background: white;
        color: black;
        padding: 12px 24px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
      }

      /* ===== MOBILE (CARD) ===== */
      .mobile-list {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 14px;
      }

      .mobile-card {
        min-width: 100%;
        background: #202020;
        border-radius: 12px;
        overflow: hidden;
        scroll-snap-align: start;
        
        text-decoration: none;
        color: white;
        font-family: system-ui;
      }

      .mobile-image {
        aspect-ratio: 1920 / 720;
        position: relative;
      }

      .mobile-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .mobile-info {
        padding: 14px;
      }

      .mobile-info h3 {
        margin: 0 0 6px;
        font-size: 18px;
      }

      .mobile-info p {
        margin: 0 0 12px;
        font-size: 14px;
        opacity: .85;
      }

      @media (min-width: 900px) {
        .desktop-slider { display: block; }
        .mobile-list { display: none; }
      }
    `;
    document.head.appendChild(style);

    // =============================
    // DESKTOP SLIDER
    // =============================
    const desktop = document.createElement("div");
    desktop.className = "desktop-slider";

    const track = document.createElement("div");
    track.className = "desktop-track";
    desktop.appendChild(track);

    events.forEach(ev => {
      const slide = document.createElement("div");
      slide.className = "desktop-slide";
      slide.innerHTML = `
        <img src="${ev.img}">
        <div class="desktop-gradient"></div>
        <div class="desktop-info">
          <h2>${ev.nombre}</h2>
          <p>${ev.lugar}</p>
          <a class="buy-btn" href="${basePath}pages/events/?id=${ev.idEvento}">
            Comprar
          </a>
        </div>
      `;
      track.appendChild(slide);
    });

    let index = 0;
    setInterval(() => {
      index = (index + 1) % events.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    }, 7000);

    // =============================
    // MOBILE CARDS
    // =============================
    const mobile = document.createElement("div");
    mobile.className = "mobile-list";

    events.forEach(ev => {
      const card = document.createElement("a");
      card.className = "mobile-card";
      card.href = `${basePath}pages/events/?id=${ev.idEvento}`;
      card.innerHTML = `
        <div class="mobile-image">
          <img src="${ev.img}">
          <div class="mobile-gradient"></div>
        </div>
        <div class="mobile-info">
          <h3>${ev.nombre}</h3>
          <p>${ev.lugar}</p>
          <span class="buy-btn">Comprar</span>
        </div>
      `;
      mobile.appendChild(card);
    });

    slider.appendChild(desktop);
    slider.appendChild(mobile);

  } catch (e) {
    console.error("Slider error:", e);
  }
});
