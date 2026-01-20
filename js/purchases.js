// IMPORTS
import { auth, db } from "./firebase.js";
import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONTENEDOR
const purchasesContainer = document.getElementById("purchases-container");

// 🔹 Función para cargar compras
async function loadPurchases() {
  const user = auth.currentUser;
  if (!user) {
    purchasesContainer.innerHTML = '<p class="no-purchases">You must be logged in to see your purchases.</p>';
    return;
  }

  const uid = user.uid;
  const purchasesRef = collection(db, "users", uid, "purchases");
  const snap = await getDocs(purchasesRef);

  if (snap.empty) {
    purchasesContainer.innerHTML = '<p class="no-purchases">No purchases yet.</p>';
    return;
  }

  purchasesContainer.innerHTML = "";

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const purchaseDate = data.purchaseDate?.toDate ? data.purchaseDate.toDate() : new Date(data.purchaseDate);
    const dateStr = purchaseDate.toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });

    const card = document.createElement("div");
    card.classList.add("purchase-card");
    card.innerHTML = `
      <img src="${data.eventImage}" alt="${data.eventName}" class="purchase-image">
      <div class="purchase-info">
        <h3>${data.eventName}</h3>
        <p>Purchase #: ${data.purchaseNumber}</p>
        <p>Date: ${dateStr}</p>
        <p>Venue: ${data.venue}</p>
      </div>
    `;
    purchasesContainer.appendChild(card);
  });
}

// 🔹 Simular compra para pruebas
async function simulatePurchase() {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to simulate a purchase");
    return;
  }

  const uid = user.uid;

  const purchaseData = {
    eventName: "Billie Eilish Concert",
    eventImage: "https://i.imgur.com/1XxVJ7N.jpg", // Imagen de ejemplo real
    purchaseNumber: "AT-" + Math.floor(Math.random()*1000000),
    purchaseDate: new Date(),
    venue: "River Plate Stadium"
  };

  const purchaseRef = doc(collection(db, "users", uid, "purchases"));
  await setDoc(purchaseRef, purchaseData);

  alert("Purchase simulated!");
  loadPurchases();
}

// 🔹 Botón simular
const simulateBtn = document.getElementById("simulatePurchaseBtn");
if (simulateBtn) simulateBtn.addEventListener("click", simulatePurchase);

// 🔹 Cargar compras cuando usuario esté logueado
auth.onAuthStateChanged(user => {
  if (user) loadPurchases();
});
