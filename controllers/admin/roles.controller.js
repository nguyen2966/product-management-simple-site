//GET /admin/roles
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")

module.exports.index = async (req, res) => {
   let find = {
      deleted: false
   }
   const records = await Role.find(find)
   res.render("admin/pages/roles/index", {
      pageTitle: "Trang phân quyền",
      records: records
   })
}

module.exports.create = async (req, res) => {
   let find = {
      deleted: false
   }
   const records = await Role.find(find)
   res.render("admin/pages/roles/create", {
      pageTitle: "Thêm quyền",
      records: records
   })
}

module.exports.createPost = async (req, res) => {
   const record = new Role(req.body)
   await record.save()

   res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async (req, res) => {
   let find = {
      _id: req.params.id,
      deleted: false
   }
   const record = await Role.findOne(find)
   if (record) console.log(record)


   res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa quyền",
      record: record
   })
}

module.exports.editPatch = async (req, res) => {
   try {
      await Role.updateOne({ _id: req.params.id }, req.body)
      req.flash("success", "Cập nhật thành công")
      res.redirect(`${systemConfig.prefixAdmin}/roles`)
   } catch (error) {
      req.flash("error", "Cập nhật thất bại")
      res.redirect(`${systemConfig.prefixAdmin}/roles`)
   }
}
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
   let find = {
      deleted: false
   }
   const records = await Role.find(find)

   res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records
   })
}
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
   try {
      const permissions = JSON.parse(req.body.permissions)

      for (const item of permissions) {
         const id = item.id
         const permissions = item.permissions
         await Role.updateOne({ _id: id }, { permissions: permissions })
      }
      req.flash("Cập nhật phân quyền thành công")
      res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
   } catch {
      req.flash("Cập nhật quyền thất bại")
      res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
   }

}