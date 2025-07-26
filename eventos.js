const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const evento = eventos[id];

if (!evento) {
  document.getElementById("evento").innerHTML = "<h2>Evento no encontrado</h2>";
} else {

  document.getElementById("imagen").src = evento.img;

}


