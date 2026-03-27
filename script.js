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

window.openCart = ()=>{
 if(cart.length==0){ alert("Cart Empty"); return; }

 let name = prompt("Enter Name");
 let phone = prompt("Enter Mobile");
 let address = prompt("Enter Address");

 if(!name||!phone||!address) return alert("Fill details");

 placeOrder(name,phone,address);
}

async function placeOrder(name,phone,address){
 let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

 let order = {
  name,phone,address,
  items:cart,
  total,
  status:"New",
  date:new Date().toLocaleString()
 };

 let docRef = await addDoc(collection(db,"orders"), order);

 // Save order for invoice
 localStorage.setItem("lastOrder", JSON.stringify(order));

 // WhatsApp Message
 let msg="*Azad Prime Medico Order*%0A";
 cart.forEach(i=>{
  msg+=i.name+" x"+i.qty+" = ₹"+(i.price*i.qty)+"%0A";
 });
 msg+="Total: ₹"+total;

 window.open("https://wa.me/91YOURNUMBER?text="+msg);

 // UPI Payment
 window.open("upi://pay?pa=YOURUPI@okaxis&pn=AzadPrimeMedico&am="+total);

 // Invoice Page
 window.open("invoice.html");

 cart=[];
 saveCart();
 alert("Order Placed");
}

async function loadProducts(){
 const snap = await getDocs(collection(db,"products"));
 let html="";

 snap.forEach(doc=>{
  let p=doc.data();
  html+=`
  <div class="card">
  <img src="${p.image}">
  <h3>${p.name}</h3>
  <p>₹${p.price}</p>
  <button class="btn
