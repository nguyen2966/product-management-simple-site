//Show alert
const Alert = document.querySelector("[show-alert]")
if(Alert){
    const time = parseInt(Alert.getAttribute("data-time"))
    setTimeout(()=>{
        Alert.remove()
    },time)
}
//End show alert