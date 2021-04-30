import axios from "axios";
export const request = (config)=>{
    const inst = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        timeout:10000,
    })
    inst.interceptors.request.use(config =>{
        config.headers.authorization=sessionStorage.getItem('token')
        return config
    })
    inst.interceptors.response.use(data => {
        return data.data
    })
    return inst(config).catch(err=>{

    })
}