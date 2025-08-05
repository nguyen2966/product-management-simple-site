const generalSetting = require("../../models/setting-general")

module.exports.general = async (req,res)=>{
    const setting = await generalSetting.findOne() 
    res.render("admin/pages/settings/general",{
        pageTitle:"Cài đặt chung",
        generalSetting: setting
    })
}

module.exports.generalPatch = async (req,res)=>{
    const setting = await generalSetting.findOne()
    if(setting){
        await generalSetting.updateOne(
            {_id: setting.id},
            req.body
        )
    }
    else{
        const record = new generalSetting(req.body)
        await record.save()
    }
    
    req.flash("success","Cập nhật thành công")
    res.redirect(req.get("referer"))
}