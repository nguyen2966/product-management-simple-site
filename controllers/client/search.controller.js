const Product = require("../../models/products.model")
const ProductHelper = require("../../helpers/products")
module.exports.index= async (req,res)=>{
    //fetch featured products
    const keyword = req.query.keyword
    let products= []

    if(keyword){
        const keywordRegex = new RegExp(keyword,"i")
        products = await Product.find({
          title: keywordRegex,
          status:"active",
          deleted:false
        })
       
        ProductHelper.pricenew(products)
    }
    
    
    res.render("client/pages/search/index",{
        pageTitle: "Kết quả tìm kiếm",
        products: products
    })
    
}