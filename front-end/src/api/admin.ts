import { $get, $post } from '../utils/request.ts'
import { ElNotification } from 'element-plus'
import { md5 } from 'md5js'

export const $Login = async (params: object) => {
    let once_md5_str = md5(params.password).split('').reverse().join('')
    let password = md5(once_md5_str, 32)
    // let ret = $post('api/login', { ...params, password })
    let ret = await $post('auth/login', { ...params })
    if (ret.code === 200) {
        // 登录成功后，将 token 信息保存到浏览器缓存
        sessionStorage.setItem('x-token', ret.token)
        ElNotification({ title: '提示', message: ret.msg, type: 'success' })
        return true
    } else {
        ElNotification({ title: '提示', message: ret.msg, type: 'error' })
        return false
    }
}

// 获取当前用户的基本信息
export const $GetUserInfo = async () => {
    let ret = await $get('/user/userInfo')
    // {"code":200,"message":"获取用户信息成功","data":{"id":1,"username":"admin","phone":"66666","name":"管理员","photo":"http://dalong.local:8081/static/image1701632006885.jpg"}}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret.data
}

// 获取用户列表
export const $GetUserList = async (params: object) => {
    let ret = await $get('/user/userList', params)
    // {"code":200,"message":"获取用户信息成功","data":{"id":1,"username":"admin","phone":"66666","name":"管理员","photo":"http://dalong.local:8081/static/image1701632006885.jpg"}}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 根据 username 获取用户详情
export const $GetUserDetail = async (params: object) => {
    let ret = await $get('/user/userDetail', params)
    // {"code":200,"message":"获取用户信息成功","data":{"id":1,"username":"admin","phone":"66666","name":"管理员","photo":"http://dalong.local:8081/static/image1701632006885.jpg"}}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 添加用户
export const $AddUser = async (params: object) => {
    let once_md5_str = md5(params.password).split('').reverse().join('')
    let password = md5(once_md5_str, 32)
    let ret = $post('user/addUser', { ...params, password })
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 删除用户
export const $DelUser = async (params: object) => {
    let ret = await $get('/user/deleteUser', params)
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}

// 编辑用户
export const $UpdateUser = async (params: object) => {
    let ret = await $post('/user/editUser', params)
    // {"code":200,"msg":"新增成功"}
    // console.log(`ret = ${JSON.stringify(ret)}`)
    return ret
}
