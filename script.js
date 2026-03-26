import { db } from "./firebase.js";
import { collection, getDocs, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart(){
  document.getElementById("cartCount").innerText = cart.length;
  saveCart();
}

window.addToCart = (id,name,price)=>{
  let item = cart.find(i => i.id === id);

  if(item){
    item.qty++;
  }else{
    cart.push({id,name,price,qty:1});
  }

  updateCart();
}

window.openCart = ()=>{
  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }

  let name = prompt("Enter Name");
  let phone = prompt("Enter Mobile");
  let address = prompt("Enter Address");
  let pincode = prompt("Enter Pincode");

  if(!name || !phone || !address){
    alert("Please fill all details");
    return;
  }

  placeOrder(name, phone, address, pincode);
}

async function placeOrder(name,phone,address,pincode){
  let total = cart.reduce((sum,item)=> sum + item.price * item.qty, 0);

  try{
    await addDoc(collection(db,"orders"),{
      name,
      phone,
      address,
      pincode,
      items: cart,
      total,
      status: "New",
      date: new Date().toLocaleString()
    });

    alert("Order Placed Successfully");

    cart = [];
    updateCart();
    localStorage.removeItem("cart");

  }catch(e){
    alert("Order Failed");
    console.log(e);
  }
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
      <button class="btn" onclick="addToCart('${doc.id}','${p.name}',${p.price})">Add to Cart</button>
    </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
}

loadProducts();
updateCart();
