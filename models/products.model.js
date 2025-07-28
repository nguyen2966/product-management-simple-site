const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    {
        title: String, // San pham 1
        product_category_id:{
            type:String,
            default:''
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
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

const Product = mongoose.model('Product',productSchema,'products')  

module.exports = Product