const express = require('express')
require('dotenv').config() //Line nay de add cau hình từ .env
const route = require("./routes/client/index.route")

const database = require("./config/database")
database.connect()

const app = express()
const port = process.env.PORT

app.set("views","./views")
app.set("view engine","pug")

app.use(express.static("public"))//nhúng file tĩnh



route(app)

app.listen(port,()=>{
    console.log("Example app listening on port "+ port)
})

 