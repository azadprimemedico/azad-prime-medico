import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqpzQLN_qu53CKbPa_XFDnoyN6SgxhKRw",
  authDomain: "azad-prime-medico.firebaseapp.com",
  projectId: "azad-prime-medico",
  storageBucket: "azad-prime-medico.firebasestorage.app",
  messagingSenderId: "111274201862",
  appId: "1:111274201862:web:a052eff79eca9f7d1ac487"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
