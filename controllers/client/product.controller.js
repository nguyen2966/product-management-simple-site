//GET /products
const Product = require("../../models/products.model")
const ProductCategory = require("../../models/products-category.model")
const systemConfig = require("../../config/system")
const ProductHelper = require("../../helpers/products")
const CategoryHelper = require("../../helpers/product-category")

module.exports.index = async (req,res)=>{
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position:"desc"})

    const newProducts = ProductHelper.pricenewProducts(products)

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
        res.render("client/pages/products/detail",{
          pageTitle: product.title,
          product: product
        })
    } catch(error) {
        res.redirect(`/products`)
    }
}

module.exports.category = async (req,res)=>{
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted:false,
    })

    
    const allCategory = await CategoryHelper.getSubCategory(category.id)

    allCategory.forEach((cate)=>{console.log(cate.title)})

    const allCateId = allCategory.map(cate=>cate.id)

    const products = await Product.find({
        product_category_id : { $in: [category.id, ...allCateId]},
        deleted:false
    }).sort({position:"desc"})

    const newProducts = ProductHelper.pricenewProducts(products)
    
    res.render("client/pages/products/index",{
        pageTitle: category.title,
        products : newProducts
    })
}