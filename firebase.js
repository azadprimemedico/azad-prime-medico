import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqpzQlN_qu53CKbPa_XFDnoyN6SgxhKRw",
  authDomain: "azad-prime-medico.firebaseapp.com",
  projectId: "azad-prime-medico"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
