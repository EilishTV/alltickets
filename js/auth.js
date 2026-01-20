// auth.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -----------------------------
// 📌 BasePath (GitHub Pages / local)
// -----------------------------
function getBasePath() {
  let basePath = "/";
  if (location.hostname.includes("github.io")) {
    const parts = location.pathname.split("/").filter(Boolean);
    basePath = "/" + parts[0] + "/";
  }
  return basePath;
}

// -----------------------------
// 📌 Obtener datos ordenados del usuario
// -----------------------------
async function getUserDataOrdered(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    idType: data.idType,
    idNumber: data.idNumber,
    country: data.country,
    gender: data.gender,
    createdAt: data.createdAt?.toDate
      ? data.createdAt.toDate()
      : data.createdAt
  };
}

// -----------------------------
// 📌 Mostrar usuario en navbar
// -----------------------------
const userContainer = document.getElementById("user-container");

async function mostrarUsuario() {
  const user = auth.currentUser;
  if (!user || !userContainer) return;

  const userData = await getUserDataOrdered(user.uid);
  if (!userData) return;

  userContainer.innerHTML = `
    ${userData.firstName}
    <a href="#" id="logout">Salir</a>
  `;

  document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();
    await auth.signOut();
    location.reload();
  });
}

// -----------------------------
// 📌 SIGN UP
// -----------------------------
const signupForm = document.querySelector("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signupForm.querySelector("#email").value.trim();
    const password = signupForm.querySelector("#password").value.trim();
    const confirm = signupForm.querySelector("#confirm-password").value.trim();
    const firstName = signupForm.querySelector("#first-name").value.trim();
    const lastName = signupForm.querySelector("#last-name").value.trim();
    const country = signupForm.querySelector("#country").value;
    const phone = signupForm.querySelector("#phone").value.trim();
    const idType = signupForm.querySelector("#id-type").value;
    const idNumber = signupForm.querySelector("#id-number").value.trim();
    const dob = signupForm.querySelector("#dob").value;
    const gender = signupForm.querySelector("#gender").value;

    if (!email || !password || !confirm || !firstName || !lastName) {
      alert("Completá todos los campos obligatorios");
      return;
    }
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        firstName,
        lastName,
        idType,
        idNumber,
        country,
        gender,
        phone,
        dob,
        createdAt: new Date()
      });

      alert("Cuenta creada correctamente");
      window.location.replace(getBasePath() + "login/");

    } catch (error) {
      console.error("Error signup:", error);
      alert("Error creando usuario: " + error.message);
    }
  });
}

// -----------------------------
// 📌 LOGIN
// -----------------------------
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector("#loginEmail").value.trim();
    const password = loginForm.querySelector("#loginPassword").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await mostrarUsuario();
      window.location.replace(getBasePath());
    } catch (error) {
      console.error("Error login:", error);
      alert("Usuario o contraseña incorrectos");
    }
  });
}

// -----------------------------
// 📌 LOGIN GOOGLE
// -----------------------------
const googleBtn = document.querySelector("#googleBtn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          firstName: user.displayName || "Usuario",
          lastName: "",
          idType: "",
          idNumber: "",
          country: "",
          gender: "",
          phone: "",
          dob: "",
          createdAt: new Date()
        });
      }

      await mostrarUsuario();
      window.location.replace(getBasePath());

    } catch (error) {
      console.error("Error Google login:", error);
      alert("Error iniciando sesión con Google");
    }
  });
}

// -----------------------------
// 📌 Detectar sesión activa
// -----------------------------
onAuthStateChanged(auth, (user) => {
  if (user) mostrarUsuario();
});
