import { db } from "./firebase.js";
import { collection, getDocs, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart(){
  document.getElementById("cartCount").innerText = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = (id,name,price)=>{
  cart.push({id,name,price,qty:1});
  updateCart();
}

window.openCart = async ()=>{
  let name = prompt("Enter Name");
  let phone = prompt("Enter Phone");
  let address = prompt("Enter Address");

  let total = cart.reduce((sum,item)=> sum + item.price, 0);

  await addDoc(collection(db,"orders"),{
    name,
    phone,
    address,
    items: cart,
    total,
    status:"New",
    date: new Date().toLocaleString()
  });

  alert("Order Placed!");
  cart = [];
  updateCart();
}

async function loadProducts(){
  const snap = await getDocs(collection(db,"products"));
  let html="";

  snap.forEach(doc=>{
    let p = doc.data();
    html += `
    <div class="card">
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button class="btn" onclick="addToCart('${doc.id}','${p.name}',${p.price})">Add</button>
    </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
}

loadProducts();
updateCart();
