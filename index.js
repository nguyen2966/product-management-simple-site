const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const session = require('express-session')

const flash = require('express-flash')
require('dotenv').config() //Line nay de add cau hình từ .env
const route = require("./routes/client/index.route")
const admin_route = require("./routes/admin/index.route")
const systemConfig = require("./config/system")

const database = require("./config/database")
database.connect()

const app = express()
const port = process.env.PORT

app.use(methodOverride("_method"))

//parse application
app.use(bodyParser.urlencoded({extended:false}))

//Flash
app.use(cookieParser("NLN"))
app.use(session({cookie:{maxAge: 60000}}))
app.use(flash())
//End Flash

app.set("views","./views")
app.set("view engine","pug")

app.use(express.static("public"))//nhúng file tĩnh

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
//this to use in all pug files


admin_route(app)
route(app)

app.listen(port,()=>{
    console.log("Example app listening on port "+ port)
})

 