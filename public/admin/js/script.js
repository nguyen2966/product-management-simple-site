const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length > 0 ){
    buttonStatus.forEach(button=>{
        let url = new URL(window.location.href)
        button.addEventListener("click",()=>{
            const status = button.getAttribute("button-status")
            if(status){
                url.searchParams.set("status",status)
            }
            else {
                url.searchParams.delete("status")
            }
            console.log(url.href)
            window.location.href = url.href
        })
    })
}