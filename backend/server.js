const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = "./users.json";

// Leer usuarios guardados
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- Registro (signup)
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Usuario ya existe" });
  }

  users.push({ username, password });
  saveUsers(users);

  res.json({ message: "Usuario registrado con éxito" });
});

// --- Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

  res.json({ message: "Inicio de sesión correcto", username });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
