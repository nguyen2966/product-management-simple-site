const mongoose = require("mongoose")


const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type:Array,
            default:["Thêm sản phẩm","Xóa sản phẩm"]
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedDate: Date
    },{
        timeStamps: true
    }
)

const Role = mongoose.model('Role',roleSchema,'roles')  

module.exports = Role