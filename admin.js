import { db } from "./firebase.js";
import { collection, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.addProduct = async ()=>{
 await addDoc(collection(db,"products"),{
  name: name.value,
  price: Number(price.value),
  category: category.value,
  image: image.value
 });

 alert("Product Added");
}
