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
    } 

    let keyword=""
    if(req.query.keyword) {
        keyword = req.query.keyword

        const regex = new RegExp(keyword,"i")
        //Regular expression for searching similar strings with input
        find.title = regex
    }

    
    const products = await Product.find(find)

   res.render("admin/pages/products/index",{
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
   })
}