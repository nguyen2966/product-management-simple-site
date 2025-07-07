const express = require('express')
require('dotenv').config() //Line nay de add cau hình từ .env
const route = require("./routes/client/index.route")
const admin_route = require("./routes/admin/index.route")

const database = require("./config/database")
database.connect()

const app = express()
const port = process.env.PORT

app.set("views","./views")
app.set("view engine","pug")

app.use(express.static("public"))//nhúng file tĩnh


admin_route(app)
route(app)

app.listen(port,()=>{
    console.log("Example app listening on port "+ port)
})

 