const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const session = require('express-session')
const moment = require("moment")
const { Server } = require("socket.io")
const http = require('http');

const flash = require('express-flash')
require('dotenv').config() //Line nay de add cau hình từ .env
const route = require("./routes/client/index.route")
const admin_route = require("./routes/admin/index.route")
const systemConfig = require("./config/system")

const database = require("./config/database")
database.connect()

const app = express()
const port = process.env.PORT
// Socket io
const server = http.createServer(app);
const io = new Server(server)
global._io = io // create a global var to use anywhere 

// end socket io

app.use(methodOverride("_method"))

//parse application
app.use(bodyParser.urlencoded({extended:false}))

//Flash
app.use(cookieParser("NLN"))
app.use(session({cookie:{maxAge: 60000}}))
app.use(flash())
//End Flash

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TinyMCE

app.set("views",`${__dirname}/views`)
app.set("view engine","pug")



app.use(express.static(`${__dirname}/public`))//nhúng file tĩnh
//deploy online cần truyền từ thu mục gốc

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment
//this to use in all pug files


admin_route(app)
route(app)


server.listen(port,()=>{
    console.log("Example app listening on port "+ port)
})

 