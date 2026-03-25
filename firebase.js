import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "azad-prime-medico.firebaseapp.com",
  projectId: "azad-prime-medico"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
