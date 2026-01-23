document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("purchases-container");
  if (!contenedor) return;

  contenedor.style.paddingTop = "8rem";
  contenedor.style.display = "grid";
  contenedor.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
  contenedor.style.gap = "1rem";
  contenedor.style.justifyItems = "center";
  contenedor.style.paddingLeft = "4rem";
  contenedor.style.paddingRight = "4rem";

  const titulo = document.createElement("h1");
  titulo.textContent = "Mis Entradas";
  titulo.style.gridColumn = "1 / -1";
  titulo.style.textAlign = "center";
  titulo.style.marginBottom = "2rem";
  contenedor.appendChild(titulo);

  let entradas = JSON.parse(localStorage.getItem("misEntradas")) || [];

  // 🔥 MOSTRAR ÚLTIMA COMPRA PRIMERO
  entradas = entradas.reverse();

  if (entradas.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No tienes entradas compradas aún.";
    mensaje.style.gridColumn = "1 / -1";
    mensaje.style.textAlign = "center";
    mensaje.style.fontSize = "1.2rem";
    mensaje.style.color = "#555";
    contenedor.appendChild(mensaje);
  } else {
    entradas.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("purchase-item");
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.alignItems = "center";
      div.style.justifyContent = "flex-start";
      div.style.width = "280px";
      div.style.height = "235px";
      div.style.border = "1px solid #ccc";
      div.style.borderRadius = "8px";
      div.style.backgroundColor = "#f9f9f9";
      div.style.textAlign = "left";
      div.style.overflow = "hidden";
      div.style.position = "relative";

      div.innerHTML = `
        <div style="
          position:absolute;
          top:0;
          left:0;
          width:100%;
          aspect-ratio: 1920 / 720;
          overflow:hidden;
        ">
          <img src="${item.img}" alt="${item.nombre}" 
               style="
                 width:100%;
                 height:100%;
                 object-fit:contain;
                 display:block;
               ">
        </div>

        <div style="width:100%; text-align:left; padding:7.5rem; margin-left:0.8rem;">
          <strong style="display:block; margin-bottom:0.2rem;">${item.nombre}</strong>
          <div style="font-size:0.9rem; margin-bottom:0.2rem;">${item.venue}</div>
          <div style="font-size:0.9rem; margin-bottom:0.2rem;">${item.cantidad} ticket/s</div>
          <div style="font-size:0.9rem;">${item.fechaCompra}</div>    
        </div>
      `;

      contenedor.appendChild(div);
    });
  }
});
