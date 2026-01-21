// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* --------------------------------------------------
   🔥 Detectar BASE_PATH automáticamente
   - Live Server      → /
   - GitHub Pages repo → /nombre-del-repo/
-------------------------------------------------- */
function detectBasePath() {
  if (location.hostname.includes("github.io")) {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}/` : "/";
  }
  return "/";
}

// Exponer basePath globalmente
export const BASE_PATH = detectBasePath();
window.BASE_PATH = BASE_PATH;

/* --------------------------------------------------
   🔥 Firebase config
-------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyBKNIkEp6LcxHJtdPoRL8NW8zrHpV5gX-Q",
  authDomain: "allticketsar.firebaseapp.com",
  projectId: "allticketsar",
  storageBucket: "allticketsar.firebasestorage.app",
  messagingSenderId: "516838010437",
  appId: "1:516838010437:web:7469d442ee3ded5ca93d2c",
  measurementId: "G-B23SF9HFBX"
};

/* --------------------------------------------------
   🔥 Inicializar Firebase
-------------------------------------------------- */
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
