//Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length>0){
    const formChangeSatus = document.querySelector("#form-change-status")
    const path =formChangeSatus.getAttribute("data-path")
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

//Delete items
const deleteButtons = document.querySelectorAll("[button-delete]")
if(deleteButtons.length>0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")
    deleteButtons.forEach(button=>{
       button.addEventListener("click",()=>{
          const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này")
          if(isConfirm){
            const id = button.getAttribute("data-id")

            const action = `${path}/${id}?_method=DELETE`
            formDeleteItem.action = action
            formDeleteItem.submit()
          }
       })
    })
}
//End delete items