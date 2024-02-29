import { $get, $post } from '../utils/request.ts'

// 获取角色列表 http://127.0.0.1:8081/my/roleList?page=1&pageSize=3
export const $GetRoleList = async () => {
    let ret = await $get('/user/roleList', { page: 1, pageSize: 20 })
    // {"code":200,"msg":"获取成功","data":[{"roleId":1,"roleName":"系统管理员"},{"roleId":2,"roleName":"普通管理员"},{"roleId":3,"roleName":"妞妞大魔王"}],"page":"1","pageSize":"3","total":6}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret.data
}

export const $GetRole = async (params: object) => {
    let ret = await $get('/user/getRole', params)
    return ret.data
}

// 添加角色
export const $AddRole = async (params: object) => {
    let ret = await $post('/user/addRole', params)
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 删除角色
export const $DelRole = async (params: object) => {
    let ret = await $get('/user/deleteRole', params)
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 编辑角色
export const $UpdateRole = async (params: object) => {
    let ret = await $post('/user/updateRole', params)
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}