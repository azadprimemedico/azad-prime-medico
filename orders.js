import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

async function loadOrders(){
  const snap = await getDocs(collection(db,"orders"));
  let html="";

  snap.forEach(doc=>{
    let o = doc.data();

    html += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;">
        <h3>${o.name}</h3>
        <p>${o.phone}</p>
        <p>${o.address}</p>
        <p>Total: ₹${o.total}</p>
        <p>Status: ${o.status}</p>
      </div>
    `;
  });

  document.getElementById("orders").innerHTML = html;
}

loadOrders();
