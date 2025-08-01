const systemConfig = require("../../config/system.js")

const authMiddleware = require("../../middlewares/admin/auth.middleware.js")

const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const prodcutCategoryRoutes = require("./product-category.route")
const rolesRoutes = require("./roles.route")
const accountRoutes = require("./account.route.js")
const authRoutes = require("./auth.route.js")
const myAccountRoutes = require("./my-account.route.js")

module.exports = (app)=>{
    const ADMIN_PATH = systemConfig.prefixAdmin 
    app.use(ADMIN_PATH + "/dashboard",
        authMiddleware.requireAuth
        ,dashboardRoutes)

    app.use(ADMIN_PATH + "/products",
        authMiddleware.requireAuth,
        productRoutes)

    app.use(ADMIN_PATH + "/products-category",
        authMiddleware.requireAuth,
        prodcutCategoryRoutes)

    app.use(ADMIN_PATH + "/roles",
        authMiddleware.requireAuth,
        rolesRoutes)

    app.use(ADMIN_PATH + "/accounts",
        authMiddleware.requireAuth,
        accountRoutes)

    app.use(ADMIN_PATH +"/auth",
        authRoutes)

    app.use(ADMIN_PATH+ "/my-account",
        authMiddleware.requireAuth,
        myAccountRoutes)
}