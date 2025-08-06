
// GET /chat
module.exports.index = (req,res)=>{
    //SocketIO
    // _io is a global var init in index.js
    _io.on('connection',(socket)=>{
    console.log('a user connected',socket.id)
    })
    // End socket
    res.render("client/pages/chat/index",{
       pageTitle: "Chat"
    })
}