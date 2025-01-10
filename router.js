import { createRouter, createWebHistory } from 'vue-router';

// 定義路由 (使用懶加載)
const routes = [
	{ path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    { path: '/image', name: 'Image', component: () => import('./views/Image.vue') },
    { path: '/status', name: 'Status', component: () => import('./views/Status.vue') },
    { path: '/minecraft/status', name: 'MCStatus', component: () => import('./views/MCStatus.vue') },
    { path: '/minecraft/rcon', name: 'MCRcon', component: () => import('./views/MCRcon.vue') },
    { path: '/users', name: 'Users', component: () => import('./views/Users.vue') },
    { path: '/settings', name: 'Settings', component: () => import('./views/Settings.vue') },
    { path: '/login', name: 'Login', component: () => import('./views/Login.vue') },
    { path: '/dashboard', name: 'Dashboard', component: () => import('./views/Dashboard.vue') },
];

// 創建路由器 (使用 history 模式)
const router = createRouter({
	history: createWebHistory(), // 使用 history 模式，不使用 hash
	routes,
});

export default router;
