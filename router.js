import { createRouter, createWebHistory } from 'vue-router';

// 定義路由 (使用懶加載)
const routes = [
	{ path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    { path: '/image', name: 'Image', component: () => import('./views/Image.vue') },
    { path: '/tools/img2pdf', name: 'Img To PDF', component: () => import('./views/tools/ImgToPDF.vue') },
    { path: '/tools/remove-bg', name: 'Image Remove Background', component: () => import('./views/tools/RemoveBG.vue') },
    { path: '/minecraft/status', name: 'Minecraft Server Status', component: () => import('./views/Minecraft/Status.vue') },
    { path: '/minecraft/rcon', name: 'Minecraft RCON', component: () => import('./views/Minecraft/Rcon.vue') },
    // { path: '/users', name: 'Users', component: () => import('./views/Users.vue') },
    { path: '/settings', name: 'Settings', component: () => import('./views/Settings.vue') },
    { path: '/login', name: 'Login', component: () => import('./views/auth/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('./views/auth/Register.vue') },
    { path: '/reset-password', name: 'Reset Password', component: () => import('./views/auth/ResetPassword.vue') },
    // { path: '/dashboard', name: 'Dashboard', component: () => import('./views/Dashboard.vue') },

    { path: '/account/apikey', name: 'Account API Key Manage', component: () => import('./views/account/ApiKeys.vue') },
    { path: '/account/dashboard', name: 'Account Dashboard', component: () => import('./views/account/Dashboard.vue') },
    { path: '/account/profile', name: 'Account Profile', component: () => import('./views/account/Profile.vue') },
    { path: '/admin/apikey', name: 'Admin API Key Manage', component: () => import('./views/admin/ApiKeyManagement.vue') },
    { path: '/admin/users', name: 'User Management', component: () => import('./views/admin/UserManagement.vue') },
    { path: '/admin/roles', name: 'Admin Role Manage', component: () => import('./views/admin/RoleManagement.vue') },
];

// 創建路由器 (使用 history 模式)
const router = createRouter({
	history: createWebHistory(), // 使用 history 模式，不使用 hash
	routes,
});

export default router;
