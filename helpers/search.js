module.exports = (query) =>{
    let objectSearch = {
        keyword: "",
        regex: ""
    }
    if(query.keyword) {
        objectSearch.keyword = query.keyword
        objectSearch.regex = new RegExp(objectSearch.keyword,"i")
        //Regular expression for searching similar strings with input
    }
    return objectSearch
}