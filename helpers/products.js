
module.exports.pricenewProducts= (products)=>{
    //fetch featured product
    const newProducts = products.map(item=>{
        item.priceNew = (item.price * (100-item.discountPercentage) /100).toFixed(2)
        return item
    })

    return newProducts
}


module.exports.pricenew = (product)=>{
    //fetch featured product
    product.priceNew = (product.price * (100-product.discountPercentage) /100).toFixed(2)
}