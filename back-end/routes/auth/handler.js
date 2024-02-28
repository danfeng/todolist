/** 在这里定义和相关的路由处理函数，供/routes/index.js 模块进行调用 */

// 导入数据库模块
const db = require('../../db/index')

// 导入生成Token的包
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const config = require('../../config')

// 注册用户的处理函数
exports.regUser = function (req, res) {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    userInfo.roleId = 2
    // 定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, [userInfo.username], (err, results) => {
        if (err) return res.cc(500, '数据库查询错误')
        if (results.length > 0) {
            return res.send({ code: 400, msg: '用户名已存在' })
        }
        // 执行其他操作--将输入插入数据库
        const insertSql = 'insert into ev_users set ?'
        db.query(insertSql, userInfo, (err, results) => {
            if (err) return res.cc(500, '数据库插入错误')
            if (results.affectedRows > 0) {
                return res.cc(200, '注册成功')
            }
        })
    })
}
// 登录的处理函数
exports.login = function (req, res) {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    // 定义SQL语句
    const sqlStr = 'select * from ev_users where username=? and password=?'
    db.query(sqlStr, [userInfo.username, userInfo.password], (err, results) => {
        if (err) return res.cc(500, '数据库查询错误')
        if (results.length !== 1) {
            return res.cc(400, '登录失败')
        }
        // TODO: 在服务端生成Token的字符串
        const user = { ...results[0], password: '', user_pic: '' }
        // {"id":1,"username":"admin","password":"","name":"管理员","phone":"66666","userPic":"http://dalong.local:8081/static/image1701632006885.jpg","roleId":1,"user_pic":""}

        // 对用户的信息进行加密，生成Token字符串
        // 参数1：用户的信息对象
        // 参数2：加密的秘钥
        // 参数3：配置对象，可以配置当前 token 的有效期
        // 记住：千万不要把密码加密到 token 字符中
        const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // 调用res.send()将Token响应给客户端
        res.send({ code: 200, msg: '登录成功', token: 'Bearer ' + token })
    })
}