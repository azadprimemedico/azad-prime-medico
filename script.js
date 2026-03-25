import { db } from "./firebase.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let products=[];
let cart=JSON.parse(localStorage.getItem("cart"))||[];

async function loadProducts(){
 let snap=await getDocs(collection(db,"products"));
 products=[];
 snap.forEach(doc=>{
  products.push({id:doc.id,...doc.data()});
 });
 showProducts(products);
 renderCart();
}

function showProducts(data){
 let html="";
 data.forEach(p=>{
 html+=`
 <div class="card">
 <img src="${p.image}" width="100">
 <h4>${p.name}</h4>
 ₹${p.price}
 <button onclick="addToCart('${p.id}')">Add</button>
 </div>`;
 });
 document.getElementById("products").innerHTML=html;
}

window.addToCart=(id)=>{
 let p=products.find(x=>x.id===id);
 let item=cart.find(x=>x.id===id);
 if(item) item.qty++;
 else cart.push({...p,qty:1});
 saveCart();
 renderCart();
}

function saveCart(){
 localStorage.setItem("cart",JSON.stringify(cart));
}

function renderCart(){
 let html="",total=0,qty=0;
 cart.forEach((i,index)=>{
 total+=i.price*i.qty;
 qty+=i.qty;
 html+=`${i.name} x${i.qty}
 <button onclick="inc(${index})">+</button>
 <button onclick="dec(${index})">-</button><hr>`;
 });
 document.getElementById("cartItems").innerHTML=html;
 document.getElementById("total").innerText="Total ₹"+total;
 document.getElementById("count").innerText=qty;
}

window.inc=(i)=>{cart[i].qty++;saveCart();renderCart();}
window.dec=(i)=>{if(cart[i].qty>1)cart[i].qty--;else cart.splice(i,1);saveCart();renderCart();}

window.openCart=()=>document.getElementById("cartPopup").style.display="block";
window.closeCart=()=>document.getElementById("cartPopup").style.display="none";

window.placeOrder=async()=>{
 let n=name.value,p=phone.value,a=address.value,pin=pincode.value;
 if(!n||!p||!a||!pin||cart.length==0){
  alert("Fill all details");
  return;
 }

 let total=cart.reduce((s,i)=>s+i.price*i.qty,0);

 let ref=await addDoc(collection(db,"orders"),{
  name:n,phone:p,address:a,pincode:pin,
  items:cart,total:total,status:"Pending",
  date:new Date().toLocaleString()
 });

 alert("Order Placed. ID: "+ref.id);

 cart=[];
 saveCart();
 renderCart();
}

window.trackOrder=()=>{
 let p=phone.value;
 if(!p) return alert("Enter phone");
 window.open("orders.html?phone="+p);
}

window.searchProduct=()=>{
 let q=search.value.toLowerCase();
 showProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
}

loadProducts();
