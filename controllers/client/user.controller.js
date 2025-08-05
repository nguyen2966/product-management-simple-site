const User = require("../../models/user.model")
const md5 = require("md5")

module.exports.register = async (req,res)=>{
    res.render("client/pages/user/register",{
        pageTitle: "Đăng ký tài khoản"
    })
}

module.exports.registerPost = async (req,res)=>{
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash("error","Email đã tồn tại")
        return res.redirect(req.get("referer"))
    }
    
    req.body.password = md5(req.body.password)
    const passwordExist = await User.findOne({
        password: req.body.password,
        deleted:false
    })
    if(passwordExist){
        req.flash("error","Mật khẩu bị trùng lặp")
        return res.redirect(req.get("referer"))
    }

    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}