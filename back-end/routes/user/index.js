const express = require('express');

// 创建路由对象
const router = express.Router();

// Multer 是一个node.js中间件，用于处理 multipart/form-data 类型的表单数据，主要用于上传文件。
const multer = require('multer');
const path = require('path');

// 导入路由处理函数模块
const handler = require('./handler');

//图片上传-配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatar/'); // 上传的文件保存到 uploads 目录
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'image' + Date.now() + ext); // 保存为 image 时间戳 文件名
  },
});
const upload = multer({ storage: storage });

// 处理图片上传的路由
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const imageUrl = '/static/avatar/' + req.file.filename; // 返回上传成功后的图片 URL
  res.send({ code: 200, msg: '上传成功', imageUrl });
});

// 获取当前用户的基本信息
router.get('/userInfo', handler.getUserInfo);

// 根据用户名获取用户信息
router.get('/userDetail', handler.getUserName);

// 查询用户列表
router.get('/userList', handler.getUserList);

// 删除用户信息
router.get('/deleteUser', handler.deleteUser);

// 新增用户信息
router.post('/addUser', handler.addUser);

// 更新用户信息
router.post('/editUser', handler.editUser);

// 查询角色列表
router.get('/roleList', handler.getRoleList);

// 查询角色全字段
router.get('/getRole', handler.getOneRole);

// 新增角色列表
router.post('/addRole', handler.addRole);

// 更新角色信息
router.post('/updateRole', handler.updateRole);

// 删除角色信息
router.get('/deleteRole', handler.deleteRole);

module.exports = router;
