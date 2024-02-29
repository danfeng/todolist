/// 路由文件

// 将 createRouter、createWebHistory 引入vue
import { createRouter, createWebHistory } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// http://localhost:5173/#/index
const routes = [
    {
        path: '/', //配置默认路由
        name: 'login', //路由名
        meta: { title: '登录' },
        component: () => import('../views/Login.vue') //引入该路由使用的组件
    },
    {
        path: '/login',
        redirect: '/'
    },
    {
        path: '/index',
        meta: { title: 'xxxxx' },
        component: () => import('../views/Index.vue'),
        children: [
            {
                // path: 'home',
                path: '',
                meta: { title: '首页' },
                component: () => import('../views/Home.vue')
            },
            {
                path: 'mail',
                meta: { title: '邮件' },
                component: () => import('../views/Mail.vue')
            },
            {
                path: 'message',
                meta: { title: '消息' },
                component: () => import('../views/Message.vue')
            },
            {
                path: 'mine',
                meta: { title: '个人中心' },
                component: () => import('../views/user/Mine.vue')
            },
            {
                path: 'setpwd',
                meta: { title: '修改密码' },
                component: () => import('../views/user/SetPwd.vue')
            },
            {
                path: 'role',
                meta: { title: '角色管理' },
                component: () => import('../views/user/Role.vue')
            },
            {
                path: 'user',
                meta: { title: '用户管理' },
                component: () => import('../views/user/User.vue')
            },
            {
                path: 'room',
                meta: { title: '房间管理' },
                component: () => import('../views/room/Room.vue')
            },
            {
                path: 'roomtype',
                meta: { title: '房型管理' },
                component: () => import('../views/room/RoomType.vue')
            },
            {
                path: 'livein',
                meta: { title: '入住管理' },
                component: () => import('../views/custom/LiveIn.vue')
            },
            {
                path: 'order',
                meta: { title: '订单管理' },
                component: () => import('../views/custom/Order.vue')
            },
            {
                path: 'sysmenu',
                meta: { title: '菜单管理' },
                component: () => import('../views/system/Menu.vue')
            },
            {
                path: 'sysdict',
                meta: { title: '字典管理' },
                component: () => import('../views/system/Dictionary.vue')
            }
        ]
    }
    // {
    //   path: '/a',

    //   name: 'a',
    //   component: () => import('../views/a.vue'),
    //   redirect: '/a/son1',
    //   children: [
    //     //配置子路由
    //     {
    //       path: '/a/son1', //子路由路径前边必须写父路由路径
    //       name: 'ason1',
    //       component: () => import('../views/a-son1.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '/b',

    //   name: 'b',
    //   component: () => import('../views/b.vue'),
    //   redirect: '/b/son1', //重定向，进入/b路由时默认进入/b/son1
    //   children: [
    //     //配置子路由
    //     {
    //       path: '/b/son1', //子路由路径前边必须写父路由路径
    //       name: 'bson1',
    //       component: () => import('../views/b-son1.vue')
    //     }
    //   ]
    // }
]

const router = createRouter({
    history: createWebHistory(), // 设置为history模式
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title
    }
    NProgress.done()
})
export default router