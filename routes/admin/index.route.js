const systemConfig = require("../../config/system.js")

const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")


module.exports = (app)=>{
    const ADMIN_PATH = systemConfig.prefixAdmin 
    app.use(ADMIN_PATH + "/dashboard",dashboardRoutes)
    app.use(ADMIN_PATH + "/products",productRoutes)
}