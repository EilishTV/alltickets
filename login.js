// ================================
// 🔐 LOGIN Y REGISTRO (Signup)
// ================================

const API_URL = "https://alltickets-backend.onrender.com"; // cambia esta URL cuando tu backend esté online

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Inicio de sesión exitoso ✅");
        localStorage.setItem("usuario", username);
        window.location.href = "/"; // redirigir al inicio
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  });
}

// SIGNUP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Usuario registrado con éxito 🎉");
        window.location.href = "/login/";
      } else {
        alert(data.message || "Error al registrarse");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  });
}
