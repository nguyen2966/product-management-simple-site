//GET /products
const Product = require("../../models/products.model")

module.exports.index = async (req,res)=>{
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position:"desc"})

    const newProducts = products.map(item=>{
        item.priceNew = (item.price * (100-item.discountPercentage) /100).toFixed(2)
        return item
    })

    res.render("client/pages/products/index",{
        pageTitle: "Danh sách sản phẩm",
        products : newProducts
    })
}

//[GET] /products/:slug
module.exports.detail = async (req,res)=>{
    try{
        const find= {
            deleted: false,
            slug: req.params.slug,
            status:"active"
        }

        const product = await Product.findOne(find)
        console.log(product)
        res.render("client/pages/products/detail",{
          pageTitle: product.title,
          product: product
        })
    } catch(error) {
        res.redirect(`/products`)
    }
    
   
}