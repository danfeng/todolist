// swagger在线网站：https://editor.swagger.io/#
// Open API 规范（OAS）https://spec.openapis.org/oas/latest.html#openapi-specification

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const host = `http://${process.env.IP}:${process.env.PORT}`;

const swaggerInit = (app, baseUrl) => {
    // options是swaggerJSDoc的配置项
    const options = {
        swagger: '2.0',
        // definition是swagger的配置项
        definition: {
            openapi: '3.1.0', // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md
            info: {
                // API information (required)
                title: '接口文档', // Title (required)
                version: '1.0.0', // Version (required)
                description: '我的接口文档，Optional multiline or single-line description in [CommonMark](https://commonmark.org/help/) or HTML.', // Description (optional)
                host, // Host (optional)
                basePath: '/', // Base path (optional)
                termsOfService: "https://example.com/terms/",
                license: {
                    name: "Licensed Under MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                },
                contact: {
                    name: "ios",
                    email: "iospai@qq.com",
                    url: "https://github.com/DesmondSanctity/node-js-swagger"
                },
            },
            // production、staging、testing
            servers: [
                {
                    url: "http://localhost:3000/",
                    description: "本机服务器地址"
                },
                {
                    url: "http://dalong.local:3000/",
                    description: "局域网服务器地址"
                },
                {
                    url: "<your live url here>",
                    description: "服务器地址"
                },
            ]
        },
        // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
        // 包含OpenAPI定义的文件路径apis: ['./routes/*.js'],
        apis: [path.join(process.cwd(), '/api/swagger.*.yaml')],
    }

    const swaggerSpec = swaggerJSDoc(options)

    // 可以访问 xxx/swagger.json 看到生成的swaggerJSDoc
    app.get('/api/swagger.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })

    // 可以访问 xxx/api-docs 看到生成的swagger接口文档
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = swaggerInit