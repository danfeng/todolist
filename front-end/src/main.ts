import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn'


// 导入路由配置
import router from './router/index.ts'

import { createPinia } from 'pinia'
import persistence from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persistence)

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(pinia)
app.use(router)
app.mount('#app')
