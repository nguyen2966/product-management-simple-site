//GET /products
const Product = require("../../models/products.model")
const Cart = require("../../models/cart.model")
const Order = require("../../models/orders.model")
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

    res.render("client/pages/checkout/index",{
        pageTitle:"Đặt hàng",
        cartDetail:cart
    })
}

module.exports.order = async (req,res)=>{
    const cartId = req.cookies.cartId
    console.log(cartId)
    const userInfo = req.body

    const cart = await Cart.findOne({_id: cartId})

    let products = []
    for(const item of cart.products){
        const objectProduct = {
            product_id: item.product_id,
            price : 0,
            discountPercentage : 0,
            quantity: item.quantity
        }
        const productInfo = await Product.findOne({_id: item.product_id})
        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }

    const objectOrder = {
        cart_id : cartId,
        userInfo : userInfo,
        products : products
    }

    const order = new Order(objectOrder)
    await order.save()

    await Cart.updateOne({_id:cartId},{
        products: []
    })
    res.redirect(`checkout/success/${order.id}`)
}