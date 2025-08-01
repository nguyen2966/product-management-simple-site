module.exports = (query)=>{
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class:""
        },
        {
            name: "Hoạt động",
            status: "active",
            class:""
        }
    ]
    if(query.status){
      const index = filterStatus.findIndex(item => item.status == query.status)
      filterStatus[index].class="active"
    } else{
        const index = filterStatus.findIndex(item=>item.status=="")
        filterStatus[index].class="active"
    }

    return filterStatus
}