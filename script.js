import { db } from "./firebase.js";
import { collection, getDocs, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let productsData = [];

/* SAVE CART */
function saveCart(){
 localStorage.setItem("cart", JSON.stringify(cart));
 let c = document.getElementById("cartCount");
 if(c) c.innerText = cart.length;
}

/* ADD TO CART */
window.addToCart = (id,name,price)=>{
 let item = cart.find(i=>i.id===id);
 if(item) item.qty++;
 else cart.push({id,name,price,qty:1});
 saveCart();
}

/* VIEW CART */
window.viewCart = ()=>{
 if(cart.length==0){
  alert("Cart Empty");
  return;
 }

 let text="Cart Items:\n";
 cart.forEach(i=>{
  text+=i.name+" x"+i.qty+"\n";
 });
 alert(text);
}

/* SAVE ORDER */
window.placeOrder = async ()=>{
 let name = document.getElementById("custName").value;
 let phone = document.getElementById("custPhone").value;
 let address = document.getElementById("custAddress").value;

 if(!name || !phone || !address){
  alert("Enter customer details");
  return;
 }

 let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

 let order = {
  name, phone, address,
  items: cart,
  total,
  status:"New",
  date:new Date().toLocaleString()
 };

 await addDoc(collection(db,"orders"), order);
 localStorage.setItem("lastOrder", JSON.stringify(order));

 alert("Order Saved");
}

/* WHATSAPP */
window.whatsappOrder = ()=>{
 let order = JSON.parse(localStorage.getItem("lastOrder"));
 if(!order){ alert("Save order first"); return; }

 let msg="Azad Prime Medico Order\n";
 order.items.forEach(i=>{
  msg+=i.name+" x"+i.qty+" = ₹"+(i.price*i.qty)+"\n";
 });
 msg+="Total ₹"+order.total;

 window.open("https://wa.me/917633801161?text="+encodeURIComponent(msg));
}

/* UPI */
window.upiPayment = ()=>{
 let order = JSON.parse(localStorage.getItem("lastOrder"));
 if(!order){ alert("Save order first"); return; }

 window.open("upi://pay?pa=gulamhamid164@okaxis&pn=AzadPrimeMedico&am="+order.total);
}

/* INVOICE */
window.openInvoice = ()=>{
 window.open("invoice.html");
}

/* SEARCH */
window.searchProducts = ()=>{
 let s = document.getElementById("search").value.toLowerCase();
 let filtered = productsData.filter(p=>p.name.toLowerCase().includes(s));
 displayProducts(filtered);
}

/* DISPLAY PRODUCTS */
function displayProducts(list){
 let html="";
 list.forEach(p=>{
  html+=`
  <div class="card">
   <img src="${p.image}">
   <h3>${p.name}</h3>
   <p>₹${p.price}</p>
   <button class="btn" onclick="addToCart('${p.id}','${p.name}',${p.price})">Add to Cart</button>
  </div>
  `;
 });
 document.getElementById("products").innerHTML=html;
}

/* LOAD PRODUCTS */
async function loadProducts(){
 const snap = await getDocs(collection(db,"products"));
 productsData=[];
 snap.forEach(doc=>{
  let p=doc.data();
  p.id=doc.id;
  productsData.push(p);
 });
 displayProducts(productsData);
}

loadProducts();
saveCart();
