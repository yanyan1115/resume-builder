import { createApp } from 'vue'; 
import App from './App.vue';
import router from './router';  // 引入路由配置
import './assets/styles/index.scss'  // 引入样式文件
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus)
app.use(router);  // 使用路由
app.mount('#app');