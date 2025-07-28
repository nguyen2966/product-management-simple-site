//GET /admin/roles
const Role = require("../../models/role.model")

module.exports.index = async (req,res)=>{
   let find= {
     deleted:false
   }
   const records = await Role.find(find)
   res.render("admin/pages/roles/index",{
    pageTitle: "Trang phân quyền",
    records:records
   })
}

module.exports.create = async (req,res)=>{
   let find = {
      deleted:false
   }
   const records = await Role.find(find)
   res.render("admin/pages/roles/create",{
    pageTitle: "Thêm quyền",
    records:records
   })
}

module.exports.createPost = async (req,res)=>{
   console.log(req.body)
   const record = new Role(req.body)
   await record.save()

   res.redirect("admin/roles")
}