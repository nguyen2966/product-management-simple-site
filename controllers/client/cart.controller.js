const Cart = require("../../models/cart.model")
const Product = require("../../models/products.model")

module.exports.index = async (req,res)=>{
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    })
    
    if(cart.products.length>0){
        for(const item of cart.products){
            const productId = item.product_id

            const productDetail = await Product.findOne({
                _id: productId
            })
            productDetail.priceNew = (productDetail.price * (100-productDetail.discountPercentage) /100).toFixed(0)
            item.productInfo = productDetail
            item.totalPrice = item.quantity*productDetail.priceNew
        }

        cart.totalPrice = cart.products.reduce((sum,item)=>sum+item.totalPrice,0)
    }

    res.render("client/pages/cart/index",{
        pageTitle:"Giỏ hàng",
        cartDetail:cart
    })
}

module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({ _id: cartId })

    const existProductInCart = cart.products.find(item => item.product_id == productId)

    if (existProductInCart) {
        //Just update quantity for this case
        const newQuantity = quantity + existProductInCart.quantity
        console.log(newQuantity)
        
        await Cart.updateOne(
            {
               _id:cartId,
               'products.product_id': productId
            },{
                'products.$.quantity': newQuantity
            }
        )

    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }


        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        )
    }
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
    res.redirect(req.get("referer"))
}

module.exports.delete = async (req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    await Cart.updateOne({_id: cartId},{
      "$pull": {
        products: {"product_id":productId}
      }
    })
    req.flash("success","Xóa thành công")

    res.redirect(req.get("referer"))
}

module.exports.update= async (req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity
     await Cart.updateOne(
            {
               _id:cartId,
               'products.product_id': productId
            },{
                'products.$.quantity': quantity
            }
        )
    req.flash("success","Đã cập nhật số lượng")
    res.redirect(req.get("referer"))
}