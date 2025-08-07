//CLIENT_SEND_MESSAGE
var socket = io()
const formSendData = document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit",(e)=>{
        e.preventDefault()
        const myId = document.querySelector("[my-id]").getAttribute("my-id")
        const content = e.target.elements.content.value
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE",{
                userId : myId,
                content: content
            })
            e.target.elements.content.value = ""
        }
    })
}
// End CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE",(data)=>{
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const div = document.createElement("div")
    let htmlFullname = ""

    if(myId == data.userId){
       div.classList.add("inner-outgoing")
    }
    else {
        div.classList.add("inner-incoming")
        htmlFullname = `<div class="inner-name">${data.fullName}</div>`
    }
    div.innerHTML = `
             ${htmlFullname}
             <div class="inner-content">${data.content}</div>
           `
    // Insert before the last child
    const lastChild = body.lastElementChild
    if (lastChild && lastChild.previousElementSibling) {
       body.insertBefore(div,lastChild);
    }
})
//End SERVER_RETURN_MESSAGE