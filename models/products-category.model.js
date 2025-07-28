const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
    {
        title: String, // San pham 1
        parent_id: {
            type: String,
            default:''
        },
        description: String,
        thumbnail: String,
        status : String,
        position: Number,
        slug: {
            type: String,
            slug: "title" ,
            unique: true //san-pham-1
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

const ProductCategory = mongoose.model('ProductCategory',productCategorySchema,'products-category')  

module.exports = ProductCategory