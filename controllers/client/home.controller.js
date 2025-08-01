const Product = require("../../models/products.model")
const ProductHelper = require("../../helpers/products")

module.exports.index= async (req,res)=>{
    //fetch featured products
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    const newProducts = ProductHelper.pricenewProducts(productsFeatured)
 
    res.render("client/pages/home/index",{
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    })
}