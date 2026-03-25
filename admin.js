import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

async function loadProducts(){
 let snap=await getDocs(collection(db,"products"));
 let html="";
 snap.forEach(d=>{
 let p=d.data();
 html+=`${p.name} ₹${p.price}
 <button onclick="del('${d.id}')">Delete</button><br>`;
 });
 list.innerHTML=html;
}

window.addProduct=async()=>{
 await addDoc(collection(db,"products"),{
  name:pname.value,
  price:Number(price.value),
  category:category.value,
  image:image.value
 });
 loadProducts();
}

window.del=async(id)=>{
 await deleteDoc(doc(db,"products",id));
 loadProducts();
}

loadProducts();
