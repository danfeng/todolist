import axios from 'axios'
import { baseURL } from '../config/baseurl.ts'

// 初始化 axios 实例
const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'X-Custom-Header': 'foo' }
})

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        config.headers['Authorization'] = sessionStorage.getItem('x-token')
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    }
)

// 封装 get 请求方法
export const $get = async (url: string, params: object = {}) => {
    let { data } = await instance.get(url, { params })
    return data
}

// 封装 post 请求方法
export const $post = async (url: string, params: object = {}) => {
    let { data } = await instance.post(url, params)
    return data
}