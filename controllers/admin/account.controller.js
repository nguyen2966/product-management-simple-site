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

module.exports.edit = async (req, res) => {
   let find = {
      _id: req.params.id,
      deleted: false
   }
   const record = await Account.findOne(find)
   const roles = await Role.find({deleted:false})
   res.render("admin/pages/accounts/edit", {
      pageTitle: "Cập nhật tài khoản",
      record: record,
      roles:roles
   })
}


module.exports.editPatch = async (req, res) => {
   try {
      const emailExsit = await Account.findOne({
        _id: {$ne: id}, //Update case, let it update if there no other account with same email
        // this case has different logic with create case
        email: req.body.email,
        deleted:false
      })
      if(emailExist){
        req.flash("error","Email đã tồn tại")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
      }
      if(req.body.password){
        req.body.password = md5(req.body.password)
      }else{
        delete req.body.password
      }
      
      await Account.updateOne({ _id: req.params.id }, req.body)
      req.flash("success", "Cập nhật thành công")
      res.redirect(`${systemConfig.prefixAdmin}/accounts`)
   } catch (error) {
      req.flash("error", "Cập nhật thất bại")
      res.redirect(`${systemConfig.prefixAdmin}/accounts`)
   }
}