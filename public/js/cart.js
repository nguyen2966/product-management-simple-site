//Update in cart
console.log("OK cart")
const quantities = document.querySelectorAll("input[name='quantity']")
if(quantities.length>0){
    quantities.forEach(input=>{
        input.addEventListener("change",(e)=>{
           const productId=input.getAttribute("product-id")
           const quantity = parseInt(input.value)
           if(quantity >= 1){
               window.location.href=`/cart/update/${productId}/${quantity}`
           }
        })
    })
}
//End update in cart