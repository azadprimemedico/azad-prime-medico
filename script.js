import { db } from "./firebase.js";
import { collection, getDocs, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
 localStorage.setItem("cart", JSON.stringify(cart));
 document.getElementById("cartCount").innerText = cart.length;
}

window.addToCart = (id,name,price)=>{
 let item = cart.find(i=>i.id===id);
 if(item) item.qty++;
 else cart.push({id,name,price,qty:1});
 saveCart();
}

window.openCart = async ()=>{
 if(cart.length==0){ alert("Cart Empty"); return; }

 let name = prompt("Enter Name");
 let phone = prompt("Enter Mobile");
 let address = prompt("Enter Address");

 if(!name||!phone||!address) return alert("Fill details");

 let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

 await addDoc(collection(db,"orders"),{
  name,phone,address,
  items:cart,
  total,
  status:"New",
  date:new Date().toLocaleString()
 });

 let msg="Order:%0A";
 cart.forEach(i=>{
  msg+=i.name+" x"+i.qty+" = "+(i.price*i.qty)+"%0A";
 });
 msg+="Total: "+total;

 window.open("https://wa.me/91YOURNUMBER?text="+msg);

 cart=[];
 saveCart();
 alert("Order Placed");
}

async function loadProducts(){
 const snap = await getDocs(collection(db,"products"));
 let html="";

 snap.forEach(doc=>{
  let p=doc.data();
  products.push(p);

  html+=`
  <div class="card">
  <img src="${p.image}">
  <h3>${p.name}</h3>
  <p>₹${p.price}</p>
  <button class="btn" onclick="addToCart('${doc.id}','${p.name}',${p.price})">Add</button>
  </div>`;
 });

 document.getElementById("products").innerHTML=html;
 saveCart();
}

window.searchProducts=(q)=>{
 let cards=document.querySelectorAll(".card");
 cards.forEach(c=>{
  c.style.display = c.innerText.toLowerCase().includes(q.toLowerCase()) ? "block":"none";
 });
}

loadProducts();
saveCart();
