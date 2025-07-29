//GET /admin/accounts
const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")

module.exports.index = async (req, res) => {
   let find = {
      deleted: false
   }
   const records = await Account.find(find).select("-password -token") //fetch all except pws and token

   for(const record of records){
     const role = await Role.findOne({_id:record.role_id})
     record.role = role.title
   }
   res.render("admin/pages/accounts/index", {
      pageTitle: "Danh sách tài khoản",
      records: records
   })
}

module.exports.create = async (req, res) => {
   let find = {
      deleted: false
   }
   const roles = await Role.find(find)
   const records = await Account.find(find)
   res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo mới tài khoản",
      records: records,
      roles:roles
   })
}

module.exports.createPost = async (req, res) => {
   const emailExsit = await Account.findOne({
      email: req.body.email,
      deleted:false
   })

   if(emailExsit){
      req.flash("error","Email đã được sử dụng")
      return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`)
   }

   req.body.password = md5(req.body.password)
   
   const record = new Account(req.body)
   await record.save()

   res.redirect(`${systemConfig.prefixAdmin}/accounts`)
}