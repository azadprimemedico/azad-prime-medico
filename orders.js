import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.loadOrders = async ()=>{
 const snap = await getDocs(collection(db,"orders"));

 let html="";

 snap.forEach(doc=>{
  let o=doc.data();
  if(o.phone==phone.value){
   html+=`<div>
   Order Total ₹${o.total} - ${o.status}
   </div>`;
  }
 });

 document.getElementById("orders").innerHTML=html;
}
