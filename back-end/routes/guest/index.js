const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入房型/房间信息的处理函数模块
const handler = require('./handler')

// 获取入住用户列表信息
router.get('/getGuestList', handler.getUserGuest)

// 获取结账状态信息列表
router.get('/getCheckOutList', handler.getCheckOutList)

// 新增顾客（入住用户）
router.post('/addGuest', handler.addGuest)

// 编辑顾客（入住用户）
router.post('/editGuest', handler.editGuest)

// 结账功能
router.post('/checkOut', handler.checkOut)

// 根据顾客id获取顾客已经开好的房间
router.get('/getGuestRoom', handler.getGuestRoom)

// 删除功能
router.get('/delGuest', handler.delGuest)

// 将路由对象暴露出去
module.exports = router;