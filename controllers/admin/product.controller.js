//GET /admin/products

const Product = require("../../models/products.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")

module.exports.index= async (req,res)=>{
    //Filter
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted:false
    }
    if(req.query.status){
        find.status = req.query.status
    }
    

    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    //Pagination
    let objectPagination = {
        currentPage : 1,
        limitItems : 5
    }
    if(req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page)
    }

    objectPagination.skip = (objectPagination.currentPage-1)*objectPagination.limitItems

    const countProducts = await Product.countDocuments(find)
    const toltalPages = Math.ceil(countProducts/objectPagination.limitItems)
    objectPagination.toltalPage = toltalPages
    //End Pagination

    
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

   res.render("admin/pages/products/index",{
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
   })
}