document.addEventListener("DOMContentLoaded", () => {
  // === CONFIGURACIÓN ===
  const imagenes = [
    "https://cdn.getcrowder.com/images/4458ebd9-942e-45ec-b302-9e45e21148e8-mb-1312-banneraa-1920x720.jpg?w=1920&format=webp",
    "https://cdn.getcrowder.com/images/0108b99e-9cc7-44a6-9cab-71e4460e158b-lolla-soldout-banneraa-1920x720-1-min.jpg",
    "https://cdn.getcrowder.com/images/2c298c07-dac1-4232-8080-704fac5256bb-gunsnroses-bannersaa-nuevafecha1920x720.jpg",
    "https://cdn.getcrowder.com/images/ce4820c2-c85f-4449-9a39-05dd2efc505b-a0db10ad-f301-4d46-ab9d-5042a3d44763-1920x720-wb-df-desktop.jpg?w=960&format=webp",
    "https://cdn.getcrowder.com/images/684a0192-87ec-4128-94f6-1d9d173f43fd-89b883b8-7baf-442b-8e4f-92be24cc3ba8-banner-inicio-1920-x-720-3-min.jpg?w=1920&format=webp",
  ];

  // === CREAR ELEMENTOS HTML ===
  const slider = document.createElement("div");
  slider.className = "banner-slider";

  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides-container";

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "dots-container";

  imagenes.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    if (i === 0) slide.classList.add("active");

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Imagen ${i + 1}`;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });

  slider.appendChild(slidesContainer);
  slider.appendChild(dotsContainer);
  document.getElementById("mi-slider").appendChild(slider);

  // === ESTILOS EN JS ===
  const estilos = `
    .banner-slider {
      width: 100%;
      max-width: 100%;
      margin: 30px auto;
      margin-top: 5.0rem;
      overflow: hidden;
      border-radius: 3px;
      position: relative;
      user-select: none;
      
      
    }

    .slides-container {
      display: flex;
      transition: transform 0.4s ease;
      will-change: transform;
      cursor: grab;
     
    }

    .slides-container.dragging {
      transition: none;
      cursor: grabbing;
    }

    .slide {
      min-width: 100%;
      user-select: none;
    }

    .slide img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 3px;
      pointer-events: none;
      user-select: none;
    }

    .dots-container {
      text-align: center;
      margin-top: 10px;
    }

    .dot {
      height: 12px;
      width: 12px;
      margin: 0 4px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.3s;
      cursor: pointer;
    }

    .dot.active {
      background-color: #333;
    }
  `;

  const style = document.createElement("style");
  style.textContent = estilos;
  document.head.appendChild(style);

  // === FUNCIONALIDAD ===
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let isDragging = false;

  function setSliderPosition() {
    slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function updateSlider(index) {
    currentIndex = index;
    currentTranslate = -index * slider.offsetWidth;
    prevTranslate = currentTranslate;
    slidesContainer.style.transition = "transform 0.4s ease";
    setSliderPosition();

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    updateSlider(next);
  }

  let autoSlide = setInterval(nextSlide, 4000);

  // Clic en círculos
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      clearInterval(autoSlide);
      updateSlider(parseInt(dot.dataset.index));
      autoSlide = setInterval(nextSlide, 4000);
    });
  });

  // Drag con mouse
  slidesContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    animationID = requestAnimationFrame(animation);
    slidesContainer.classList.add("dragging");
    clearInterval(autoSlide);
    slidesContainer.style.transition = "none";
  });

  slidesContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
  });

  function finishDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    slidesContainer.classList.remove("dragging");

    const movedBy = currentTranslate - prevTranslate;

    // Si se arrastró más de 100px a la izquierda o derecha
    if (movedBy < -100 && currentIndex < slides.length - 1) {
      updateSlider(currentIndex + 1);
    } else if (movedBy > 100 && currentIndex > 0) {
      updateSlider(currentIndex - 1);
    } else {
      updateSlider(currentIndex);
    }
    autoSlide = setInterval(nextSlide, 4000);
  }

  slidesContainer.addEventListener("mouseup", finishDrag);
  slidesContainer.addEventListener("mouseleave", finishDrag);

  // Soporte táctil mobile
  slidesContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    animationID = requestAnimationFrame(animation);
    slidesContainer.classList.add("dragging");
    clearInterval(autoSlide);
    slidesContainer.style.transition = "none";
  });

  slidesContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
  });

  slidesContainer.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    slidesContainer.classList.remove("dragging");

    const endX = e.changedTouches[0].clientX;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) {
      updateSlider(currentIndex + 1);
    } else if (movedBy > 100 && currentIndex > 0) {
      updateSlider(currentIndex - 1);
    } else {
      updateSlider(currentIndex);
    }
    autoSlide = setInterval(nextSlide, 4000);
  });

  // Iniciar slider en posición 0
  updateSlider(0);
});
