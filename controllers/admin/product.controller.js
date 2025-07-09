//GET /admin/products

const Product = require("../../models/products.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

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
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage : 1,
        limitItems : 5
    },req.query,
    countProducts)
    
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

//PATCH admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res)=>{
//  console.log(req.params) // Lấy ra data động từ request url
   const status = req.params.status
   const id = req.params.id
   
   await Product.updateOne({_id: id},{status: status})
   //find product with correspond id and change status
   res.redirect("/admin/products")
}

//PATCH admin/products/change-Multi
module.exports.changeMulti = async (req,res)=>{
  const type = req.body.type
  const ids = req.body.ids.split(",")
  switch(type){
    case "active":
        await Product.updateMany({_id:{$in:ids}},{status:"active"})
        break
    case "inactive":
        await Product.updateMany({_id:{$in:ids}},{status:"inactive"})
        break
  }
  res.redirect("/admin/products")
}