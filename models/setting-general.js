const mongoose = require("mongoose")


const settingGeneralSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone:String,
        email:String,
        address: String,
        copyright: String,
        deletedDate: Date
    },{
        timestamps: true
    }
)

const settingGeneral = mongoose.model('settingGeneral',settingGeneralSchema,'generalSetting')  

module.exports = settingGeneral