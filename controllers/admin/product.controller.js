//GET /admin/products

const Product = require("../../models/products.model")

module.exports.index= async (req,res)=>{
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class:""
        },
        {
            name: "Hoạt động",
            status: "active",
            class:""
        }
    ]
    let find = {
        deleted:false
    }
    if(req.query.status){
      const index = filterStatus.findIndex(item => item.status == req.query.status)
      filterStatus[index].class="active"
    } else {
      const index = filterStatus.findIndex(item => item.status == "")
      filterStatus[index].class="active"
    }

    
    const products = await Product.find(find)

   res.render("admin/pages/products/index",{
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus
   })
}