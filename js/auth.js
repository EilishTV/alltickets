// auth.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
// ⚠️ Cerrar sesión al abrir login o signup para evitar auto-login
document.addEventListener("DOMContentLoaded", async () => {
  if (location.pathname.includes("/login") || location.pathname.includes("/signup")) {
    try {
      await signOut(auth);
      localStorage.removeItem("usuario_email");
    } catch (err) {
      console.error("Error cerrando sesión al abrir login:", err);
    }
  }
});

// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // LOGIN EMAIL
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.insertAdjacentHTML("beforeend",
      '<div id="loginError" style="color:red;font-size:14px;margin-top:5px;display:none;"></div>'
    );
    const errorDiv = document.getElementById("loginError");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorDiv.style.display = "none";

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
        await signInWithEmailAndPassword(auth, email, password);
        // guardar en localStorage para navbar
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          localStorage.setItem("usuario_email", email);
          localStorage.setItem("usuario_" + email, JSON.stringify({ firstName: data.firstName, email }));
        }
        window.location.replace(getBasePath());
      } catch (err) {
        console.error("Login error:", err);
        errorDiv.textContent = "*Correo o contraseña no coinciden";
        errorDiv.style.display = "block";
      }
    });
  }

  // -----------------------------
  // GOOGLE LOGIN
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            firstName: user.displayName || "Usuario",
            email: user.email,
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

        localStorage.setItem("usuario_email", user.email);
        localStorage.setItem("usuario_" + user.email, JSON.stringify({ firstName: user.displayName || "Usuario", email: user.email }));

        window.location.replace(getBasePath());
      } catch (err) {
        console.error("Google login error:", err);
        alert("Error iniciando sesión con Google");
      }
    });
  }

  // -----------------------------
  // SIGNUP
  const signupForm = document.getElementById("signupForm");
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

      let errorDiv = signupForm.querySelector("#signupError");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "signupError";
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "14px";
        errorDiv.style.marginTop = "5px";
        signupForm.appendChild(errorDiv);
      }
      errorDiv.style.display = "none";

      if (!email || !password || !confirm || !firstName || !lastName) {
        errorDiv.textContent = "*Completá todos los campos obligatorios";
        errorDiv.style.display = "block";
        return;
      }
      if (password !== confirm) {
        errorDiv.textContent = "*Las contraseñas no coinciden";
        errorDiv.style.display = "block";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          email, firstName, lastName, idType, idNumber,
          country, gender, phone, dob, createdAt: new Date()
        });

        window.location.replace(getBasePath() + "login/");
      } catch (err) {
        console.error("Signup error:", err);
        errorDiv.textContent = "*Error creando usuario: " + err.message;
        errorDiv.style.display = "block";
      }
    });
  }

  // -----------------------------
  // LOGOUT
  window.logout = async function () {
    try {
      const email = localStorage.getItem("usuario_email");
      if (email) localStorage.removeItem("usuario_" + email);
      localStorage.removeItem("usuario_email");
      await signOut(auth);
      window.location.replace(getBasePath());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // -----------------------------
  // AUTH STATE
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;
    const data = snap.data();

    localStorage.setItem("usuario_email", user.email);
    localStorage.setItem("usuario_" + user.email, JSON.stringify({ firstName: data.firstName, email: user.email }));

    // Si está en login o signup, redirige al home
    if (location.pathname.includes("/login") || location.pathname.includes("/signup")) {
      window.location.replace(getBasePath());
    }
  });

});
