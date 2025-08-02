const Product = require("../../models/products.model")
const ProductHelper = require("../../helpers/products")

module.exports.index= async (req,res)=>{
    //fetch featured products
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    NewproductsFeatured = ProductHelper.pricenewProducts(productsFeatured)

    //fetch new products
    const newProducts = await Product.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(6)

    const displays = ProductHelper.pricenewProducts(newProducts)
    //end
 
    res.render("client/pages/home/index",{
        pageTitle: "Trang chủ",
        productsFeatured: NewproductsFeatured,
        newProducts: displays
    })
}