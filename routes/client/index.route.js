const categoryMiddleware = require("../../middlewares/client/category.middlewate")
const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")

module.exports = (app)=>{
    app.use(categoryMiddleware.category)
    // this route does not specify path so it will run for all request

    app.use("/",homeRoutes)

    app.use("/products",productRoutes)
    
    app.use("/search",searchRoutes)
}