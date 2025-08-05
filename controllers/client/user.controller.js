const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
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

module.exports.login = async (req,res) =>{
    res.render("client/pages/user/login",{
        pageTitle: "Đăng nhập"
    })
}

module.exports.loginPost = async (req,res)=>{
    const user = await User.findOne({
         email : req.body.email,
         password: md5(req.body.password),
         deleted: false
    })
    if(!user){
        req.flash("error","Email hoặc mật khẩu không chính xác")
        return res.redirect(req.get("referer"))
    }
    //save user_id into cart collection
    await Cart.updateOne({_id : req.cookies.cartId},{
        user_id: user.id
    })
    //
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

module.exports.logout = (req,res)=>{
    res.clearCookie("tokenUser")
    res.redirect("/")
}

module.exports.forgotPassword = (req,res)=>{
    res.render("client/pages/user/forgot-password",{
        pageTitle:"Lấy lại mật khẩu"
    })
}

module.exports.forgotPasswordPost = async (req,res)=>{
    const email = req.body.email

    const user = await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error","Email không tồn tại!")
        return res.redirect(req.get("referer"))
    }
    // If user with correspond email found, send OTP code
    const objectForgotPwd = {
        email: email,
        otp: "",
        expireAt: Date.now()
    }
    objectForgotPwd.otp = generateHelper.generateRandomNumbers(6)
    const forgotPwd = new ForgotPassword(objectForgotPwd)
    await forgotPwd.save()
    // Send OTP to user email
    const subject = `Mã OTP xác minh lấy lại mật khẩu`
    const html = `
          Mã OTP xác minh lấy lại mật khẩu là <b>${objectForgotPwd.otp}</b>. Thời hạn sử dụng là 
          3 phút. Lưu ý không được để lộ otp cho bất kì ai.
         `
    sendMailHelper.sendMail(email,subject,html)
    //end sending mail

    // redirect to OTP typing page
    res.redirect(`/user/password/otp?email=${email}`)

}

module.exports.otpPassword = async(req,res)=>{
    const email = req.query.email

    res.render("client/pages/user/otp-password",{
         pageTitle:"Nhập mã OTP",
         email: email
    })
}

module.exports.otpPasswordPost = async(req,res)=>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    
    if(!result){
        req.flash("error","OTP không hợp lệ")
        return res.redirect(req.get("referer"))
    }
    
    //for secuirity purpose, use user token to prevent fake access
    const tokenUser = await User.findOne(
        {email:email}).select("tokenUser")
    res.cookie("tokenUser",tokenUser) 

    res.redirect("/user/password/reset")
}

module.exports.resetPassword = async (req,res)=>{
   
    res.render("client/pages/user/reset-password",{
        pageTitle: "Đổi mật khẩu"
    })
}

module.exports.resetPasswordPost = async (req,res)=>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    
    await User.updateOne({tokenUser: tokenUser},
        {password: md5(password)}
    )
    req.flash("success","Đổi mật khẩu thành công")
    res.redirect("/")
}

module.exports.info = async (req,res) => {
    res.render("client/pages/user/info",{
        pageTitle: "Thông tin tài khoản"
    })
}