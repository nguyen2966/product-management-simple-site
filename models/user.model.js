const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema(
    {
        fullName: String, 
        email: String,
        password: String,
        tokenUser: {
            type:String,
            default: generate.generateRandomString(30)
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedDate: Date
    },{
        timestamps: true
    }
)

const User = mongoose.model('User',userSchema,'user')  

module.exports = User