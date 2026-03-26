import { db } from "./firebase.js";
import { collection, addDoc, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.addProduct = async ()=>{
  let name = document.getElementById("pname").value;
  let price = document.getElementById("pprice").value;
  let category = document.getElementById("pcategory").value;
  let image = document.getElementById("pimage").value;

  await addDoc(collection(db,"products"),{
    name,
    price: Number(price),
    category,
    image
  });

  alert("Product Added");
}

async function loadDashboard(){
  const snap = await getDocs(collection(db,"orders"));

  let orders = snap.size;
  let revenue = 0;

  snap.forEach(doc=>{
    revenue += doc.data().total;
  });

  document.getElementById("totalOrders").innerText = orders;
  document.getElementById("revenue").innerText = revenue;
}

loadDashboard();
