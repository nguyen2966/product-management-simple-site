module.exports.createPost = (req,res,next)=>{
    if(!req.body.fullName){
       req.flash("error","Vui lòng nhập họ tên")
       res.redirect(req.get('referer'))
       return
    }
    if(!req.body.email){
       req.flash("error","Vui lòng nhập Email")
       res.redirect(req.get('referer'))
       return
    }
    if(!req.body.password){
       req.flash("error","Vui lòng nhập mật khẩu")
       res.redirect(req.get('referer'))
       return
    }
    if(!req.body.phone){
       req.flash("error","Vui lòng nhập số điện thoại")
       res.redirect(req.get('referer'))
       return
    }
    next()
}

module.exports.editPatch = (req,res,next)=>{
    if(!req.body.fullName){
       req.flash("error","Vui lòng nhập họ tên")
       res.redirect(req.get('referer'))
       return
    }
    if(!req.body.email){
       req.flash("error","Vui lòng nhập Email")
       res.redirect(req.get('referer'))
       return
    }
    next()
}