import {request} from "@/network/request";

export const login = (data)=>{
    return request({
        url:'login',
        method:'post',
        data
    })
}

export const getmenu = ()=>{
    return request({
        url:'menus'
    })
}

export const getuser=(params)=>{
    return request({
        url:'users',
        params
    })
}

export const adduser=(data)=>{
    return request({
        url:'users',
        method:'post',
        data
    })
}

export const edituser=(id,data)=>{
    return request({
        url:'users/'+id,
        method:'put',
        data
    })
}

export const deluser=(id)=>{
    return request({
        url:'users/'+id,
        method:'delete'
    })
}

export const getrolelist=()=>{
    return request({
        url:'roles'
    })
}

export const changeuserrole=(id,rid)=>{
    return request({
        url:`users/${id}/role`,
        method:'put',
        data:{
            rid
        }
    })
}

export const changeuserstatus=(uid,type)=>{
    return request({
        url:`users/${uid}/state/${type}`,
        method:'put'
    })
}

export const getrights=(type)=>{
    return request({
        url:"rights/"+type
    })
}

export const addrole=(data)=>{
    return request({
        url:'roles',
        method:'post',
        data
    })
}

export const editrole=(id,data)=>{
    return request({
        url:'roles/'+id,
        method:'put',
        data
    })
}

export const delrole=id=>{
    return request({
        url:'roles/'+id,
        method:'delete'
    })
}

export const getgoods=params=>{
    return request({
        url:'goods',
        params
    })
}

export const changerights=(roleId,rids)=>{
    return request({
        url:`roles/${roleId}/rights`,
        method:'post',
        data:{
            rids
        }
    })
}

export const deluserrights=(roleId,rightId)=>{
    return request({
        url:`roles/${roleId}/rights/${rightId}`,
        method:'delete'
    })
}

export const getcatelist=(params)=>{
    return request({
        url:'categories',
        params
    })
}

export const addcate=(data)=>{
    return request({
        url:'categories',
        method:'post',
        data
    })
}

export const getparams=(id,sel)=>{
    return request({
        url:`categories/${id}/attributes`,
        params:{
            sel
        }
    })
}

export const addgoods=(data)=>{
    return request({
        url:'goods',
        method:'post',
        data
    })
}

export const getmath=()=>{
    return request({
        url: `reports/type/1`
    })
}

export const delgoods=id=>{
    return request({
        url:'goods/'+id,
        method:'delete'
    })
}

export const getgood=id=>{
    return request({
        url:'goods/'+id
    })
}

export const editgood=(id,data)=>{
    return request({
        url:'goods/'+id,
        method:'put',
        data
    })
}

export const editParamsVal=(id,attrId,data)=>{
    return request({
        url:`categories/${id}/attributes/${attrId}`,
        method:'put',
        data
    })
}

export const addParams=(id,data)=>{
    return request({
        url:`categories/${id}/attributes`,
        method:'post',
        data
    })
}

export const editParams=(id,attrId,data)=>{
    return request({
        url:`categories/${id}/attributes/${attrId}`,
        method:'put',
        data
    })
}

export const delParams=(id,attrid)=>{
    return request({
        url:`categories/${id}/attributes/${attrid}`,
        method:'delete'
    })
}

export const editCate=(id,cat_name)=>{
    return request({
        url:'categories/'+id,
        method:'put',
        data:{
            cat_name
        }
    })
}

export const delCate=id=>{
    return request({
        url:'categories/'+id,
        method:'delete'
    })
}

