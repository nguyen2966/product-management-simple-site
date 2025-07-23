//GET /admin/products

const systemConfig = require("../../config/system")

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

   req.flash("success","Cập nhật thành công trạng thái")
   //
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
  req.flash("success",`Cập nhật thành công ${ids.length} sản phẩm`)

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

  req.flash("success","Xóa thành công sản phẩm")

  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}

//POST admin/products/create
module.exports.create = (req,res)=>{
    res.render("admin/pages/products/create",{
      pageTitle:"Thêm mới sản phẩm"
    })
}

//POST admin/products/createPost
module.exports.createPost = async (req,res)=>{
    for(key in req.body){
       if(!isNaN(req.body[key]) && req.body[key]){
        req.body[key]= parseInt(req.body[key])
       }
    }
    
    if(req.body.position == ""){
      const countProducts = await Product.countDocuments()
      req.body.position = countProducts + 1
    }
    
    // if(req.file){
    //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    // Now using online url created at route
    
    const product = new Product(req.body) // save whole object to database
    await product.save() 
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req,res)=>{
  try{
      const find = {
       deleted: false,
       _id: req.params.id
      }
      const product = await Product.findOne(find)
      res.render("admin/pages/products/edit_product",{
          pageTitle: "Chỉnh sửa sản phẩm",
          product:product
        }
      )
  } catch (error){
    req.flash("error","Không có sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }

}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req,res)=>{
    for(key in req.body){
       if(!isNaN(req.body[key]) && req.body[key]){
        req.body[key]= parseInt(req.body[key])
       }
    }
    
    // if(req.file){
    //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // } 
    
    try{
       await Product.updateOne({_id: req.params.id },req.body)
       req.flash("success","Cập nhật thành công")
    } catch(error){
        req.flash("error","Cập nhật sản phẩm thất bại")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}


//[GET] /admin/products/detail/:id
module.exports.detail = async (req,res)=>{
  try{
      const find = {
       deleted: false,
       _id: req.params.id
      }
      const product = await Product.findOne(find)
      res.render("admin/pages/products/detail",{
          pageTitle: "Chi tiết sản phẩm",
          product:product
        }
      )
  } catch (error){
    req.flash("error","Không có sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}