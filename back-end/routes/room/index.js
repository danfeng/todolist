const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入房型/房间信息的处理函数模块
const handler= require('./handler')

// 查询房型列表
router.get('/getRoomType', handler.findRoomTypeList)

// 新增房型信息
router.post('/addRoomType', handler.addRoomType)

// 编辑房型信息
router.post('/editRoomType', handler.editRoomType)

// 删除房型
router.get('/delRoomType', handler.deleteRoomType)

// 查询房间信息列表
router.get('/getRoomList', handler.getRoomList)

// 查询房间状态列表
router.get('/getRoomStatusList', handler.roomStateList)

// 查询房间类型列表
router.get('/getRoomTypeList', handler.roomTypeList)

// 新增房间
router.post('/addRoom', handler.addRoom)

// 编辑房间
router.post('/editRoom', handler.editRoom)

// 删除房间
router.get('/delRoom', handler.delRoom)

//  查询酒店房型销售额信息
router.get('/hotelSaleInfo', handler.hotelSaleInfo)

// 将路由对象暴露出去
module.exports = router;