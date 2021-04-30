export const mobiletest = (rule, value, callback)=>{
    let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if(!reg.test(value)) return callback(new Error('手机号格式非法'))
    return callback()
}