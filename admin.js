import { db, storage } from "./firebase.js";
import { collection, getDocs, addDoc, updateDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

async function uploadImage(file){
 const storageRef = ref(storage,'products/'+file.name);
 await uploadBytes(storageRef,file);
 return await getDownloadURL(storageRef);
}

window.addProduct=async()=>{
 let name=pname.value;
 let price=pprice.value;
 let category=pcategory.value;
 let file=pimage.files[0];

 let image=await uploadImage(file);

 await addDoc(collection(db,"products"),{
  name,price:Number(price),category,image,stock:10
 });

 alert("Product Added");
}

async function loadOrders(){
 const snap = await getDocs(collection(db,"orders"));
 let html="";
 snap.forEach(d=>{
  let o=d.data();
  html+=`
  <div>
  ${o.name} | ₹${o.total}
  <select onchange="updateStatus('${d.id}',this.value)">
  <option>${o.status}</option>
  <option>Pending</option>
  <option>Packed</option>
  <option>Shipped</option>
  <option>Delivered</option>
  </select>
  </div><hr>`;
 });
 document.getElementById("orders").innerHTML=html;
}

window.updateStatus=async(id,status)=>{
 await updateDoc(doc(db,"orders",id),{status});
 alert("Updated");
}

loadOrders();
