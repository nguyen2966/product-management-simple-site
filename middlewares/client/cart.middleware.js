const Cart = require("../../models/cart.model")

module.exports.cartId = async (req,res,next)=>{
    if(!req.cookies.cartId){
        const cart = new Cart()
        await cart.save()
        
        const expireTime = 1000*60*60*24*365
        //expire time is 1 year

        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now() + expireTime)
        })
    } else {
      // console.log("Đã có cartId")
       const cart = await Cart.findOne({_id: req.cookies.cartId})
       if(cart.products){
          cart.toltalQuantity = cart.products.reduce((tol,item)=>{return tol+item.quantity},0)
          //console.log(cart.toltalQuantity)
          res.locals.miniCart = cart
       }
    }
    next()
}