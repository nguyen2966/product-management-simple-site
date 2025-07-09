module.exports = (objectPagination,query,countProducts)=>{
  
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page)
    }

    objectPagination.skip = (objectPagination.currentPage-1)*objectPagination.limitItems

    
    const toltalPages = Math.ceil(countProducts/objectPagination.limitItems)
    objectPagination.toltalPage = toltalPages

   return objectPagination
}