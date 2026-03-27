import { db } from "./firebase.js";
import { collection, getDocs, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
 alert("Added to cart");
}

/* OPEN CART / PLACE ORDER */
window.openCart = ()=>{
 if(cart.length==0){
  alert("Cart Empty");
  return;
 }

 let name = prompt("Enter Name");
 let phone = prompt("Enter Mobile");
 let address = prompt("Enter Address");

 if(!name || !phone || !address){
  alert("Fill details");
  return;
 }

 placeOrder(name,phone,address);
}

/* PLACE ORDER */
async function placeOrder(name,phone,address){
 try{
  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  let order = {
   name: name,
   phone: phone,
   address: address,
   items: cart,
   total: total,
   status: "New",
   date: new Date().toLocaleString()
  };

  await addDoc(collection(db,"orders"), order);

  // Save order for invoice
  localStorage.setItem("lastOrder", JSON.stringify(order));

  // WhatsApp Message
  let msg="Azad Prime Medico Order\n";
  cart.forEach(i=>{
   msg+=i.name+" x"+i.qty+" = ₹"+(i.price*i.qty)+"\n";
  });
  msg+="Total: ₹"+total;

  window.open("https://wa.me/91YOURNUMBER?text="+encodeURIComponent(msg));

  // UPI Payment
  window.open("upi://pay?pa=YOURUPI@okaxis&pn=AzadPrimeMedico&am="+total);

  // Invoice Page
  window.open("invoice.html");

  cart=[];
  saveCart();

  alert("Order Placed Successfully");

 }catch(e){
  console.error(e);
  alert("Order Failed");
 }
}

/* LOAD PRODUCTS */
async function loadProducts(){
 try{
  const snap = await getDocs(collection(db,"products"));
  let html="";

  snap.forEach(doc=>{
   let p = doc.data();

   html+=`
   <div class="card">
    <img src="${p.image}">
    <h3>${p.name}</h3>
    <p>₹${p.price}</p>
    <button class="btn" onclick="addToCart('${doc.id}','${p.name}',${p.price})">Add to Cart</button>
   </div>
   `;
  });

  document.getElementById("products").innerHTML =
   html || "<h3>No Products Found</h3>";

 }catch(e){
  console.error("Error loading products:", e);
 }
}

/* INIT */
loadProducts();
saveCart();
