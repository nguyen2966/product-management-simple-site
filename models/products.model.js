const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    {
        title: String, // San pham 1
        product_category_id: {
            type: String,
            default: ''
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true //san-pham-1
        },
        createdBy: {
            account_id: String,
            createdAt: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
             account_id: String,
             updatedAt: Date
            }
           ]
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product