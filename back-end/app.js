// 导入express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// 创建服务器的实例对象
const app = express();

// 使用morgan中间件,默认格式直接打印日志
const logger = require('morgan');
// app.use(morgan('short'))
app.use(logger('dev'));
// 自定义格式打印日志 具体格式类型可以去查看文档
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// 导入CORS中间件
const cors = require('cors')
// 将CORS注册为全局中间件
app.use(cors())

// 配置解析JSON格式的中间件
app.use(express.json());
// 解析 x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 设置静态文件上传目录
app.use('/files', express.static(__dirname + '/files'));

// 一定要在路由之前封装res.cc函数
app.use((req, res, next) => {
    res.cc = (code = 400, err) => {
        res.send({
            code: code,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
const { expressjwt } = require("express-jwt");
const config = require('./config.js')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// 即可在非排除路径下获得解密后的用户信息 通过req.auth 获取。相当于 express—jwt 6.X版本下的req.user
// const { pathToRegexp } = require('path-to-regexp');
const unprotected = [
    /^\/auth\//,
    /^\/api\//,
]
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: unprotected }))

// 导入并使用用户路由模块
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth/index')
const roomRouter = require('./routes/room')
const guestRouter = require('./routes/guest')
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/guest', guestRouter);

const swaggerInit = require('./swagger')
swaggerInit(app)

// 导入 Joi 来定义验证规则
const joi = require('joi')
// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // Joi 参数校验失败导致的错误
    if (err instanceof joi.ValidationError) res.cc(400, err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc(401, '身份认证失败')

    res.cc(500, err)
})

module.exports = app;
