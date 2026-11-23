import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/theme.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 全局注册图标，模板中可直接使用 <el-icon><component :is="图标名" /></el-icon>
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
// 不挂中文包时，Element Plus 会回落英文：分页器、空状态、详情页返回键都会是英文
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')