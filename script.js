import { db } from "./firebase.js";
import { collection, getDocs, addDoc, doc, updateDoc, increment } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function loadProducts(){
 const snap = await getDocs(collection(db,"products"));
 products=[];
 snap.forEach(d=>{
  products.push({id:d.id,...d.data()});
 });
 showProducts(products);
 renderCart();
}

function showProducts(list){
 let html="";
 list.forEach(p=>{
  html+=`
  <div class="card">
   <img src="${p.image}">
   <h3>${p.name}</h3>
   <p>₹${p.price}</p>
   <button onclick="addCart('${p.id}','${p.name}',${p.price},'${p.image}')">Add</button>
  </div>`;
 });
 document.getElementById("products").innerHTML=html;
}

window.filterCategory=(cat)=>{
 if(cat=="all") showProducts(products);
 else showProducts(products.filter(p=>p.category==cat));
}

window.searchProduct=(txt)=>{
 showProducts(products.filter(p=>p.name.toLowerCase().includes(txt.toLowerCase())));
}

window.addCart=(id,name,price,image)=>{
 let item=cart.find(i=>i.id==id);
 if(item) item.qty++;
 else cart.push({id,name,price,image,qty:1});
 localStorage.setItem("cart",JSON.stringify(cart));
 renderCart();
}

function renderCart(){
 let html="";
 let total=0;
 cart.forEach(i=>{
  total+=i.price*i.qty;
  html+=`${i.name} x ${i.qty} = ₹${i.price*i.qty}<br>`;
 });
 document.getElementById("cartItems").innerHTML=html;
 document.getElementById("total").innerText="Total ₹"+total;
 document.getElementById("count").innerText=cart.length;
}

window.openCart=()=>document.getElementById("cartPopup").style.display="block";
window.closeCart=()=>document.getElementById("cartPopup").style.display="none";

window.placeOrder=async()=>{
 let name=document.getElementById("name").value;
 let phone=document.getElementById("phone").value;
 let address=document.getElementById("address").value;
 let pincode=document.getElementById("pincode").value;

 let total=0;
 cart.forEach(i=> total+=i.price*i.qty);

 await addDoc(collection(db,"orders"),{
  name,phone,address,pincode,
  items:cart,
  total,
  status:"Pending",
  date:new Date().toLocaleString()
 });

 for(const item of cart){
  await updateDoc(doc(db,"products",item.id),{
   stock: increment(-item.qty)
  });
 }

 let msg=`New Order\nName:${name}\nPhone:${phone}\nTotal:₹${total}`;
 window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`);

 alert("Order Placed");
 cart=[];
 localStorage.removeItem("cart");
 renderCart();
}

loadProducts();
