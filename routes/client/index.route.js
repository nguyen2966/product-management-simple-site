const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")

const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")

module.exports = (app)=>{
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    // this route does not specify path so it will run for all request

    app.use("/",homeRoutes)

    app.use("/products",productRoutes)
    
    app.use("/search",searchRoutes)

    app.use("/cart",cartRoutes)

    app.use("/checkout",checkoutRoutes)

    
}