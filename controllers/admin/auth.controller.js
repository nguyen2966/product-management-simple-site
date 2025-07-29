//GET /admin/roles
const Role = require("../../models/role.model")
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const md5= require("md5")

module.exports.login = async (req, res) => {
 
   res.render("admin/pages/auth/login", {
      pageTitle: "Trang đăng nhập"
   })
}

module.exports.loginPost = async (req, res) => {
   console.log(req.body)
   const email = req.body.email
   const password = req.body.password

   const user = await Account.findOne({
      email:email,
      deleted:false
   })
   if(!user){
    req.flash("error","Email không tồn tại")
    return res.redirect("admin/auth/login")
   }

   if(md5(password) != user.password){
    req.flash("error","Mật khẩu không chính xác")
    return res.redirect("admin/auth/login")
   }

   if(user.status == 'inactive'){
     req.flash("error","Tài khoản đã bị khóa")
     return res.redirect("admin/auth/login")
   }
   res.cookie("token",user.token)
   res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}