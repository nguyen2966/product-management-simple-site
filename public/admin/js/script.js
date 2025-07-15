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


//Tìm kiếm
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault()
        const keyword = e.target.keyword.value
        if(keyword){
            url.searchParams.set("keyword",keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination) {
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button=>{
        button.addEventListener("click",()=>{
            const page = button.getAttribute("button-pagination")
            url.searchParams.set("page",page)
            window.location.href = url.href
        })
    })
}


//CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener("click",()=>{
       if(inputCheckAll.checked){
          inputsId.forEach(input=>{
            input.checked = true
          })
       }else{
          inputsId.forEach(input=>{
            input.checked= false
          })
       }
    })

    inputsId.forEach(input=>{
        input.addEventListener("click",()=>{
           const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
           if(countChecked == inputsId.length){
              inputCheckAll.checked=true
           }else{
            inputCheckAll.checked=false
           }
        })
    })
}
//End CheckBox Multi

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e)=>{
        e.preventDefault()
        
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
        
        const typeChange =e.target.elements.type.value

        if(typeChange=="delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa các sản phẩm này không?")
            if(!isConfirm){
                return //cancel
            }
        }

        if(inputsChecked.length > 0){
           let ids = []
           const inputIds = formChangeMulti.querySelector("input[name='ids']")
           inputsChecked.forEach(input=>{
             const id = input.value

             if(typeChange == "change-position"){
                const position = input.closest("tr").querySelector("input[name='position']").value
                const res = `${id}-${position}`
                ids.push(res)
             }else{
                ids.push(id)
             }

           })
        inputIds.value = ids.join(",")
        formChangeMulti.submit()
           
        } else {
        alert("Vui lòng chọn ít nhất một bản ghi")
       }
    })
    
}
//End Change Multi

//Show alert
const Alert = document.querySelector("[show-alert]")
if(Alert){
    const time = parseInt(Alert.getAttribute("data-time"))
    setTimeout(()=>{
        Alert.remove()
    },time)
}
//End show alert

//Preview Upload image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")

    uploadImageInput.addEventListener("change",(e)=>{
         const file = e.target.files[0]
         if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
            const deleteButton = document.createElement("button")
            deleteButton.setAttribute("image-delete-btn","")
            deleteButton.innerText = "X"
            deleteButton.addEventListener("click",(e)=>{
                e.preventDefault()
                deleteButton.remove()
                uploadImageInput.value=""
                uploadImagePreview.src=""
            })
            document.querySelector("[image-preview]").appendChild(deleteButton)
         }
    })
}


//End Preview Upload image