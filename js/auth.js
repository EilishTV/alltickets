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
// Base path (GitHub Pages repo-safe)
function getBasePath() {
  if (location.hostname.includes("github.io")) {
    const parts = location.pathname.split("/").filter(Boolean);
    return "/" + parts[0] + "/";
  }
  return "/";
}

// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  const path = location.pathname;

  // -----------------------------
  // 🔐 LOGIN EMAIL
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {

    let errorDiv = document.getElementById("loginError");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "loginError";
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "14px";
      errorDiv.style.marginTop = "5px";
      errorDiv.style.display = "none";
      loginForm.appendChild(errorDiv);
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorDiv.style.display = "none";

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
        await signInWithEmailAndPassword(auth, email, password);

        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          localStorage.setItem("usuario_email", email);
          localStorage.setItem(
            "usuario_" + email,
            JSON.stringify({ firstName: data.firstName, email })
          );
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
  // 🔐 GOOGLE LOGIN
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            firstName: user.displayName || "Usuario",
            lastName: "",
            country: "",
            idType: "",
            idNumber: "",
            phone: "",
            dob: "",
            gender: "",
            createdAt: new Date()
          });
        }

        localStorage.setItem("usuario_email", user.email);
        localStorage.setItem(
          "usuario_" + user.email,
          JSON.stringify({ firstName: user.displayName || "Usuario", email: user.email })
        );

        window.location.replace(getBasePath());

      } catch (err) {
        console.error("Google login error:", err);
        alert("Error iniciando sesión con Google");
      }
    });
  }

  // -----------------------------
  // 🆕 SIGNUP
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

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email, firstName, lastName,
          country, phone, idType, idNumber, dob, gender,
          createdAt: new Date()
        });

        window.location.replace(getBasePath() + "login/");

      } catch (err) {
        console.error("Signup error:", err);
        errorDiv.textContent = "*Error creando usuario";
        errorDiv.style.display = "block";
      }
    });
  }

  // -----------------------------
  // 🚪 LOGOUT GLOBAL
  window.logout = async function () {
    localStorage.clear();
    await signOut(auth);
    window.location.replace(getBasePath());
  };

  // -----------------------------
  // 🔁 AUTO-REDIRECT SOLO EN LOGIN / SIGNUP
  if (path.includes("/login") || path.includes("/signup")) {
    onAuthStateChanged(auth, (user) => {
      if (user) window.location.replace(getBasePath());
    });
  }

});
