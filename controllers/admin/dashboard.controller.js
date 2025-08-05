//GET /admin/dashboard
const Product = require("../../models/products.model")
const ProductCategory = require("../../models/products-category.model")
const Account = require("../../models/account.model")
const User = require("../../models/user.model")

module.exports.dashboard = async (req,res)=>{
   const statistic = {
      categories: {
         title: "Danh mục sản phẩm",
         total:0,
         active:0,
         inactive:0
      },
      product: {
         title: "Sản phẩm",
         total:0,
         active:0,
         inactive:0
      },
      account: {
         title: "Tài khoản quản trị",
         total:0,
         active:0,
         inactive:0
      },
      user: {
         title: "Tài khoản người dùng",
         total:0,
         active:0,
         inactive:0
      }
   }
   statistic.categories.total = await ProductCategory.countDocuments({
      deleted:false
   })
   statistic.categories.active = await ProductCategory.countDocuments({
      deleted:false,
      status:"active"
   })
   statistic.categories.inactive = statistic.categories.total - statistic.categories.active
   //
   statistic.product.total = await Product.countDocuments({
      deleted:false
   })
   statistic.product.active = await Product.countDocuments({
      deleted:false,
      status:"active"
   })
    statistic.product.inactive = statistic.product.total - statistic.product.active
   //
   statistic.account.total = await Account.countDocuments({
      deleted:false
   })
   statistic.account.active = await Account.countDocuments({
      deleted:false,
      status:"active"
   })
   statistic.account.inactive = statistic.account.total - statistic.account.active
   //
   statistic.user.total = await User.countDocuments({
      deleted:false
   })
   statistic.user.active = await User.countDocuments({
      deleted:false,
      status:"active"
   })
   statistic.user.inactive = statistic.user.total - statistic.user.active
   
   res.render("admin/pages/dashboard/index",{
    pageTitle: "Trang tong quan",
    statistic: statistic
   })
}