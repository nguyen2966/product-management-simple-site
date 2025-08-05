
const User = require("../../models/user.model")


module.exports.requireAuth = async (req,res,next) =>{
   if(!req.cookies.tokenUser){
     return res.redirect(`login`)
   } else {
      const user = await User.findOne({tokenUser: req.cookies.tkenUser}).select("-password")

      if(!user){
        return res.redirect(`login`)
      } else {
        res.locals.user = user
        next()
      } 
   }
}