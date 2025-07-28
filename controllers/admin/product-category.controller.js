const ProductCategory = require("../../models/products-category.model")
const systemConfig = require("../../config/system")
const paginationHelper = require("../../helpers/pagination")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const createTree = require("../../helpers/createTree")

module.exports.index = async (req,res)=>{
    const filterStatus = filterStatusHelper(req.query)
    let find= {
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
    const countRecord = await ProductCategory.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage : 1,
        limitItems : 5
    },req.query,
    countRecord)
    //End Pagination

    
    const record = await ProductCategory.find(find)
    const newRecord = createTree(record,"")
    res.render("admin/pages/products-category/index",{
        pageTitle:"Danh mục sản phẩm",
        record: newRecord,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination:objectPagination
    })
}

// [GET] /admin/products-category/create
module.exports.create = async (req,res)=>{
    let find = {
      deleted :false
    }

   

    const records = await ProductCategory.find(find)
    const newRecords = createTree(records,"")

    res.render("admin/pages/products-category/create",{
        pageTitle:"Tạo danh mục",
        Categories: newRecords
    })
}

// [POST] /admin/products-category/createPost
module.exports.createPost = async (req,res)=>{
    for(key in req.body){
       if(!isNaN(req.body[key]) && req.body[key]){
        req.body[key]= parseInt(req.body[key])
       }
    }
    
    if(req.body.position == ""){
      const count = await ProductCategory.countDocuments()
      req.body.position = count + 1
    }
    
    const record = new ProductCategory(req.body) // save whole object to database
    await record.save() 
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

//PATCH admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req,res)=>{
//  console.log(req.params) // Lấy ra data động từ request url
   const status = req.params.status
   const id = req.params.id
   
   await ProductCategory.updateOne({_id: id},{status: status})
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

//PATCH admin/products-category/change-Multi
module.exports.changeMulti = async (req,res)=>{
  const type = req.body.type
  const ids = req.body.ids.split(",")
  switch(type){
    case "active":
        await ProductCategory.updateMany({_id:{$in:ids}},{status:"active"})
        break
    case "inactive":
        await ProductCategory.updateMany({_id:{$in:ids}},{status:"inactive"})
        break
    case "delete-all":
        await ProductCategory.updateMany({_id:{$in:ids}},{deleted:true})
    case "change-position":
        ids.forEach(async id=>{
            const res = id.split("-")
            await ProductCategory.updateOne({_id:res[0]},{position:parseInt(res[1])})
        })
    
  }
  req.flash("success",`Cập nhật thành công ${ids.length} sản phẩm`)

  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products-category')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}

//DELETE admin/products-category/delete/:id
module.exports.deleteItem = async (req,res)=>{
  const id = req.params.id
  //await Product.deleteOne({_id:id})
  await ProductCategory.updateOne({_id:id},{
    deleted: true,
    deletedAt: new Date()
  }) //soft delete

  req.flash("success","Xóa thành công danh mục")

  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req,res)=>{
  try{
      const find = {
       deleted: false,
       _id: req.params.id
      }
      const record = await ProductCategory.findOne(find)
      res.render("admin/pages/products-category/edit",{
          pageTitle: "Chỉnh sửa danh mục sản phẩm",
          category:record
        }
      )
  } catch (error){
    req.flash("error","Không có sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req,res)=>{
    for(key in req.body){
       if(!isNaN(req.body[key]) && req.body[key]){
        req.body[key]= parseInt(req.body[key])
       }
    }
    try{
       await ProductCategory.updateOne({_id: req.params.id },req.body)
       req.flash("success","Cập nhật thành công")
    } catch(error){
        req.flash("error","Cập nhật thất bại")
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}


