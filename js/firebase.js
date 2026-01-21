// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKNIkEp6LcxHJtdPoRL8NW8zrHpV5gX-Q",
  authDomain: "allticketsar.firebaseapp.com",
  projectId: "allticketsar",
  storageBucket: "allticketsar.firebasestorage.app",
  messagingSenderId: "516838010437",
  appId: "1:516838010437:web:7469d442ee3ded5ca93d2c",
  measurementId: "G-B23SF9HFBX"
};

// Inicializar
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
