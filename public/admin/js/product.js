//Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length>0){
    const formChangeSatus = document.querySelector("#form-change-status")
    const path =formChangeSatus.getAttribute("data-path")
    console.log(path)
    buttonChangeStatus.forEach(button=>{
        button.addEventListener("click",()=>{
            const currentStatus = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            
            let statusChange = currentStatus=="active"? "inactive":"active"

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeSatus.action = action

            formChangeSatus.submit()
        })
    })
}