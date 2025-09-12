// cola.js

function iniciarCola() {
  // --- Configuración editable ---
  const usuariosPorMinuto = 5;          // cuántos "pasan" por minuto
  const tiempoEsperaSegundos = 20;       // ⏱ duración total de la espera (modificable)
  const totalUsuariosSimulados = 45;   // tamaño de la fila simulada

  // Recuperar o asignar posición
  let posicion = localStorage.getItem("posicionCola");
  if (!posicion) {
    posicion = Math.floor(Math.random() * totalUsuariosSimulados) + 1;
    localStorage.setItem("posicionCola", posicion);
  } else {
    posicion = parseInt(posicion, 10);
  }

  // Calcular minutos de espera estimados (solo para mostrar, no afecta el real)
  const minutosEstimados = Math.ceil(posicion / usuariosPorMinuto);
  let segundosRestantes = tiempoEsperaSegundos;

  // --- Overlay de cola ---
  const colaDiv = document.createElement("div");
  colaDiv.id = "cola";
  colaDiv.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
  `;

  colaDiv.innerHTML = `
    <h2 style="color:#6200EA; margin-bottom:1rem;">
      Estás en cola virtual
    </h2>
    <p id="cola-posicion">Tu posición en la fila: <b>${posicion}</b></p>
    <p id="cola-tiempo">Tiempo estimado: ${minutosEstimados} min</p>
    <div style="width:90%; max-width:400px; height:20px; border:1px solid #ccc; border-radius:10px; overflow:hidden; margin-top:1rem;">
      <div id="cola-barra" style="width:0%;  height:100%; background:#6200EA;"></div>
    </div>
    <p id="cola-restante" style="margin-top:0.5rem;">Esperando...</p>
  `;

  document.body.appendChild(colaDiv);

  const barra = document.getElementById("cola-barra");
  const tiempoRestante = document.getElementById("cola-restante");
  const posicionEl = document.getElementById("cola-posicion");

  // --- Simulación de avance ---
  const totalSegundos = segundosRestantes;
  const interval = setInterval(() => {
    segundosRestantes--;

    // Actualizar barra
    const porcentaje = Math.min(100, ((totalSegundos - segundosRestantes) / totalSegundos) * 100);
    barra.style.width = porcentaje + "%";

    // Actualizar tiempo
    const mins = Math.floor(segundosRestantes / 60);
    const secs = segundosRestantes % 60;
    tiempoRestante.textContent = `Acceso en ${mins}m ${secs}s`;

    // Avanzar posición (simulación)
    const usuariosQuePasaron = Math.floor(((totalSegundos - segundosRestantes) / 60) * usuariosPorMinuto);
    const posicionActual = Math.max(1, posicion - usuariosQuePasaron);
    posicionEl.innerHTML = `Tu posición en la fila: <b>${posicionActual}</b>`;

    if (segundosRestantes <= 0) {
      clearInterval(interval);
      localStorage.removeItem("posicionCola");
      colaDiv.remove();
      // ⚠️ Si querés volver a ejecutar cargarEvento() al salir de la cola, descomentá esto:
      // if (typeof cargarEvento === "function") {
      //   cargarEvento();
      // }
    }
  }, 1000);
}

window.addEventListener("load", iniciarCola);
