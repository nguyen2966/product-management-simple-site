const createTree = (arr,parent_id,count)=>{
  const tree = []
      arr.forEach((item)=>{
        if(item.parent_id === parent_id) {
          const newItem = item
          newItem.index = count++
          const children = createTree(arr,item.id,count)
          if(children.length > 0){
            newItem.children = children
          }
          tree.push(newItem)
        }
      })
      return tree
}

module.exports = (arr,parent_id)=>{
    let count = 0
    const tree = createTree(arr,parent_id,count)
    return tree
}
