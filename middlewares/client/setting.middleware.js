
const generalSetting = require("../../models/setting-general")

module.exports.setting = async (req,res,next) =>{
   const setting = await generalSetting.findOne()
   res.locals.setting = setting
   next()
}