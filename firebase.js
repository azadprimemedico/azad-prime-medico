import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqpzQlN_qu53CKbPa_XFDnoyN6SgxhKRw",
  authDomain: "azad-prime-medico.firebaseapp.com",
  projectId: "azad-prime-medico",
  storageBucket: "azad-prime-medico.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:123456"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
