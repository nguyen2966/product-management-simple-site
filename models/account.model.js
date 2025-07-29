const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema(
    {
        fullName: String, 
        email: String,
        password: String,
        token: {
            type:String,
            default: generate.generateRandomString(30)
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedDate: Date
    },{
        timeStamps: true
    }
)

const Account = mongoose.model('Product',accountSchema,'accounts')  

module.exports = Account