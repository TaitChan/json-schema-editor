import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElIcons from '@element-plus/icons'

const app = createApp(App)
for(let iconName in ElIcons){
    app.component(iconName,ElIcons[iconName])
}

app.use(ElementPlus, { size: 'small' })
app.mount('#app')
