const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type:Date,
            default: Date.now(),
            expires: 180
        }
        // expireAt is a special object of mongoose, allow to create object 
        // with limited lifetime with formula: expireAt + 180 s (as in this case)
    },{
        timestamps: true
    }
)

const ForgotPassword = mongoose.model('forgotPassword',forgotPasswordSchema,'forgotPassword')  

module.exports = ForgotPassword