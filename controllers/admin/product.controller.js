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

    
    const products = await Product.find(find)
    .sort({position:"desc"}) //sắp xếp theo position giảm dần
    .limit(objectPagination.limitItems) //số lượng item lấy ra mỗi trang
    .skip(objectPagination.skip)  //vị trí bắt đầu lấy

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
   const referer = req.get('referer');
   if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
     res.redirect(referer);
   } else {
     res.redirect('/admin/products');
   }
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
    case "delete-all":
        await Product.updateMany({_id:{$in:ids}},{deleted:true})
    case "change-position":
        ids.forEach(async id=>{
            const res = id.split("-")
            await Product.updateOne({_id:res[0]},{position:parseInt(res[1])})
        })
  }

  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}
//DELETE admin/products/delete/:id
module.exports.deleteItem = async (req,res)=>{
  const id = req.params.id
  //await Product.deleteOne({_id:id})
  await Product.updateOne({_id:id},{
    deleted: true,
    deletedAt: new Date()
  }) //soft delete


  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}