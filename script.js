let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
 localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart(){
 let html = "";
 let total = 0;
 let qty = 0;

 cart.forEach((item, index)=>{
   total += item.price * item.qty;
   qty += item.qty;

   html += `
   ${item.name} x${item.qty}
   <button onclick="inc(${index})">+</button>
   <button onclick="dec(${index})">-</button>
   <button onclick="removeItem(${index})">x</button>
   <hr>`;
 });

 document.getElementById("cartItems").innerHTML = html;
 document.getElementById("total").innerText = "Total ₹" + total;
 document.getElementById("count").innerText = qty;

 saveCart();
}

window.inc = (i)=>{
 cart[i].qty++;
 renderCart();
}

window.dec = (i)=>{
 if(cart[i].qty > 1) cart[i].qty--;
 else cart.splice(i,1);
 renderCart();
}

window.removeItem = (i)=>{
 cart.splice(i,1);
 renderCart();
}
