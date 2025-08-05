module.exports.generateRandomString = (length)=>{
    const string = "ABCDEWQWEMVNXNVFJHJAJCJIAWFHI2131230KKMNAnaklbfhdnxnan0123456789"
    let result = ""

    for(let i=0;i<length;i++){
        result += string.charAt(Math.floor(Math.random()*string.length))
    }

    return result
}

module.exports.generateRandomNumbers = (length)=>{
    const string = "0123456789"
    let result = ""

    for(let i=0;i<length;i++){
        result += string.charAt(Math.floor(Math.random()*string.length))
    }

    return result
}