import { createApp } from 'vue'
import './style.css'
import './assets/style/global.css';
import App from './App.vue'
import router from '../router';

createApp(App)
    .use(router)
    .mount('#app')

// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}