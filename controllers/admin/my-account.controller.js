const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")

module.exports.index = (req,res)=>{
    res.render(`admin/pages/my-account/index`,{
        pageTitle: "Thông tin cá nhân"
    })
}

module.exports.edit = (req,res)=>{
    res.render(`admin/pages/my-account/edit`,{
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    })
}

module.exports.editPatch = async (req, res) => {
   console.log(req.body)
   try {
      const emailExist = await Account.findOne({
         _id: { $ne: res.locals.user.id }, //Update case, let it update if there no other account with same email
         // this case has different logic with create case
         email: req.body.email,
         deleted: false
      })
      if (emailExist) {
         req.flash("error", "Email đã tồn tại")
         return res.redirect(`${systemConfig.prefixAdmin}/my-account-edit`)
      }
      if (req.body.password) {
         req.body.password = md5(req.body.password)
         const pwdExist = await Account.findOne({
            password: req.body.password,
            deleted: false
         })
         if (pwdExist) {
            req.flash("error", "Mật khẩu đã được sử dụng")
            return res.redirect(`${systemConfig.prefixAdmin}/my-account-edit`)
         }
      } else {
         delete req.body.password
      }

      await Account.updateOne({ _id: res.locals.user.id }, req.body)
      req.flash("success", "Cập nhật thành công")
      res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`)
   } catch (error) {
      req.flash("error", "Cập nhật thất bại")
      res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`)
   }
}