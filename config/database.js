const mongoose  = require('mongoose')
module.exports.connect = async ()=> {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connect Suceess")
    }catch(error){
        console.log("Connection Error")
    }
}
