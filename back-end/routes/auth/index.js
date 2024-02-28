const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入路由处理函数模块
const handler=require('./handler')

// 1、导入验证表单数据的中间件
const expressJoi=require('@escook/express-joi')

// 2、导入需要的验证规则对象
const { reg_login_schema} = require('../../schema/user')

router.post('/signup', expressJoi(reg_login_schema), handler.regUser)

router.post('/login', expressJoi(reg_login_schema), handler.login)

module.exports = router;
