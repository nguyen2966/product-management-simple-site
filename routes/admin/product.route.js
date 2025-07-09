const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/product.controller")

router.get("/",controller.index)

// dynamic router /: {value}
router.patch("/change-status/:status/:id",controller.changeStatus)

module.exports = router