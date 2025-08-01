//GET /admin/products

const systemConfig = require("../../config/system")

const Product = require("../../models/products.model")
const ProductCategory = require("../../models/products-category.model")
const Account = require("../../models/account.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTree = require("../../helpers/createTree")


module.exports.index = async (req, res) => {
  //Filter
  const filterStatus = filterStatusHelper(req.query)
  let find = {
    deleted: false
  }
  if (req.query.status) {
    find.status = req.query.status
  }


  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }

  //Pagination
  const countProducts = await Product.countDocuments(find)
  let objectPagination = paginationHelper({
    currentPage: 1,
    limitItems: 5
  }, req.query,
    countProducts)
  //End Pagination

  //sort
  let sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }
  //end sort

  const products = await Product.find(find)
    .sort(sort) //sắp xếp 
    .limit(objectPagination.limitItems) //số lượng item lấy ra mỗi trang
    .skip(objectPagination.skip)  //vị trí bắt đầu lấy

  for (const product of products) {
    const user = await Account.findOne({ _id: product.createdBy.account_id })

    if (user) {
      product.creatorName = user.fullName
    }

    //fetch latest updater
    const updatedBy = product.updatedBy[product.updatedBy.length - 1]
    if (updatedBy) {
      const updater = await Account.findOne({ _id: updatedBy.account_id })
      if (updater) {
        product.updaterName = updater.fullName
      }
    }

  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
}

//PATCH admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  //  console.log(req.params) // Lấy ra data động từ request url
  const status = req.params.status
  const id = req.params.id

  await Product.updateOne({ _id: id }, { status: status })
  //find product with correspond id and change status

  req.flash("success", "Cập nhật thành công trạng thái")
  //
  const referer = req.get('referer');
  if (referer && referer.startsWith('http://localhost:3000/admin/products')) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}

//PATCH admin/products/change-Multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(",")
  const updated = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  };
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, {
        status: "active",
        $push: { updatedBy: updated }
      })
      break
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, {
        status: "inactive",
        $push: { updatedBy: updated }
      })
      break
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        })
      break
    case "change-position":
      ids.forEach(async id => {
        const res = id.split("-")
        await Product.updateOne({ _id: res[0] }, {
          position: parseInt(res[1]),
          $push: { updatedBy: updated }
        })
      })

  }
  req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)

  const referer = req.get('referer');
  if (referer) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}
//DELETE admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id
  //await Product.deleteOne({_id:id})
  await Product.updateOne({ _id: id }, {
    deleted: true,
    //deletedAt: new Date()
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  }) //soft delete

  req.flash("success", "Xóa thành công sản phẩm")

  const referer = req.get('referer');
  if (referer) {
    res.redirect(referer);
  } else {
    res.redirect('/admin/products');
  }
}

//POST admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }
  const record = await ProductCategory.find(find)
  const newRecord = createTree(record, "")
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    Categories: newRecord
  })
}

//POST admin/products/createPost
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions
  if (permissions.includes("products_create")) {
    for (key in req.body) {
      if (!isNaN(req.body[key]) && req.body[key]) {
        req.body[key] = parseInt(req.body[key])
      }
    }

    if (req.body.position == "") {
      const countProducts = await Product.countDocuments()
      req.body.position = countProducts + 1
    }

    req.body.createdBy = {
      account_id: res.locals.user.id
    }

    const product = new Product(req.body) // save whole object to database
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  } else res.send("403")
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {

    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find)
    const record = await ProductCategory.find({ deleted: false })
    const newRecord = createTree(record, "")
    res.render("admin/pages/products/edit_product", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      Categories: newRecord
    }
    )
  } catch (error) {
    req.flash("error", "Không có sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }

}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    console.log(req.body);

    const updated = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    const cleanBody = Object.assign({}, req.body); // hoặc {...req.body}

    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: cleanBody,
        $push: { updatedBy: updated }
      }
    )

    console.log("reach here", result);

    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("Update Error:", error);
    req.flash("error", "Cập nhật sản phẩm thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};


//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find)
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    }
    )
  } catch (error) {
    req.flash("error", "Không có sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}