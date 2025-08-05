const express = require("express")
const router = express.Router()
const validate = require("../../validates/client/user.validate")

const controller = require("../../controllers/client/user.controller")

router.get("/register",controller.register)

router.post("/register",
    validate.registerPost,
    controller.registerPost)

router.get("/logout",controller.logout)
module.exports = router