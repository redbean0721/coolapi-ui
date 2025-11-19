<template>
	<!-- Sidebar -->
	<div class="sidebar">
		<a href="#" class="logo">
			<i class='bx bx-code-alt'></i>
			<div class="logo-name"><span>Cool</span>API</div>
		</a>
		<!-- 顯示 API 版本 -->
		<div class="apiVersion">
			<strong><p>API Version: {{ apiVersion }}</p></strong>
		</div>
		<ul class="side-menu">
			<li :class="{ active: route.path === '/' }"><router-link to="/"><i class='bx bxs-home'></i>Home</router-link></li>
			<li :class="{ active: route.path === '/image' }"><router-link to="/image"><i class='bx bxs-image'></i>Image</router-link></li>
			<!-- <li :class="{ active: route.path === '/status' }"><router-link to="/status"><i class='bx bx-line-chart'></i>Status</router-link></li> -->

			<li @click.prevent="toggleToolsMenu"><a href="#"><i class='bx bx-code-block'></i>Tools<i class="bx" :class="toolsOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i></a></li>
			<template v-if="toolsOpen">
				<li :class="{ active: route.path === '/tools/img2pdf' }" style="margin-left: 20px;"><router-link to="/tools/img2pdf"><i class="bx bx-file-blank"></i>Img To PDF</router-link></li>
				<li :class="{ active: route.path === '/tools/remove-bg' }" style="margin-left: 20px;"><router-link to="/tools/remove-bg"><i class="bx bx-file-blank"></i>Remove BG</router-link></li>
			</template>

			<!-- <li :class="{ active: route.path === '/minecraft' }"><router-link to="/minecraft"><i class='bx bx-code-alt'></i>Minecraft</router-link></li> -->
			<li @click.prevent="toggleMinecraftMenu"><a href="#"><i class='bx bx-joystick'></i>Minecraft<i class="bx" :class="minecraftOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i></a></li>
			<!-- Minecraft 子選項 -->
			<template v-if="minecraftOpen">
				<li :class="{ active: route.path === '/minecraft/status' }" style="margin-left: 20px;"><router-link to="/minecraft/status"><i class="bx bx-server"></i>Status</router-link></li>
				<li :class="{ active: route.path === '/minecraft/rcon' }" style="margin-left: 20px;"><router-link to="/minecraft/rcon"><i class="bx bx-terminal"></i>RCON</router-link></li>
			</template>
			<!-- <li :class="{ active: route.path === '/users' }"><router-link to="/users"><i class='bx bx-group'></i>Users</router-link></li> -->
			<li :class="{ active: route.path === '/settings' }"><router-link to="/settings"><i class='bx bx-cog'></i>Settings</router-link></li>
		</ul>
		<ul class="side-menu">
			<li :class="{ active: route.path === '/login' }"><router-link to="/login"><i class='bx bx-log-in'></i>Login</router-link></li>
		</ul>
		<div class="copyright">
			<p>UI Version: {{ uiVersion }}</p>
			<p>版權所有 &copy; {{ currentYear }}</p>
			<strong><a href="https://redbean0721.com" target="_blank">redbean0721.com</a></strong>
		</div>
	</div>
	<!-- End of Sidebar -->

	<!-- Main Content -->
	<div class="content">
		<!-- Navbar -->
		<nav>
			<i class='bx bx-menu'></i>
			<form action="#">
				<div class="form-input">
					<input type="search" placeholder="Search...">
					<button class="search-btn" type="submit"><i class='bx bx-search'></i></button>
				</div>
			</form>
			<input type="checkbox" id="theme-toggle" hidden>
			<label for="theme-toggle" class="theme-toggle"></label>
			<a href="#" class="notif">
				<i class='bx bx-bell'></i>
				<!-- <span class="count">12</span> -->
			</a>
			
			<!-- Admin 下拉選單 -->
			<div class="nav-dropdown" @mouseenter="openAdminMenu" @mouseleave="closeAdminMenu">
				<a href="#" class="nav-link" @click.prevent="toggleAdminMenu">
					<i class='bx bx-shield'></i>
					<span>Admin</span>
					<i class="bx bx-chevron-down"></i>
				</a>
				<div v-if="adminOpen" class="dropdown-menu">
					<router-link to="/admin/users" class="dropdown-item"><i class="bx bx-group"></i> Users</router-link>
					<router-link to="/admin/roles" class="dropdown-item"><i class="bx bx-user-check"></i> Roles</router-link>
					<router-link to="/admin/apikey" class="dropdown-item"><i class="bx bx-key"></i> API Keys</router-link>
				</div>
			</div>

			<!-- Account 下拉選單 -->
			<div class="nav-dropdown" @mouseenter="openAccountMenu" @mouseleave="closeAccountMenu">
				<a href="#" class="nav-link" @click.prevent="toggleAccountMenu">
					<i class='bx bx-user-circle'></i>
					<span>Account</span>
					<i class="bx bx-chevron-down"></i>
				</a>
				<div v-if="accountOpen" class="dropdown-menu">
					<router-link to="/account/dashboard" class="dropdown-item"><i class="bx bx-bar-chart-alt-2"></i> Dashboard</router-link>
					<router-link to="/account/apikey" class="dropdown-item"><i class="bx bx-key"></i> API Keys</router-link>
					<router-link to="/account/profile" class="dropdown-item"><i class="bx bx-user"></i> Profile</router-link>
				</div>
			</div>
			
			<a href="#" class="profile">
				<img src="/images/logo.png">
			</a>
		</nav>

		<!-- End of Navbar -->
		<main>
			<!-- 動態顯示路由內容 -->
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
import { getApiVersion, apiVersion } from './assets/js/apiVersion';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();  // 獲取當前路由
	const toolsOpen = ref(false); // Tools 開關
	const minecraftOpen = ref(false); // Minecraft 開關
	const adminOpen = ref(false); // Admin 開關
	const accountOpen = ref(false); // Account 開關
	const currentYear = ref(new Date().getFullYear()); // 新增一個 ref 來儲存年份

	// 監聽路由變化，根據路由決定選單是否展開
    const checkMenus = () => {
		// 側邊欄選單：根據路由自動展開
		toolsOpen.value = route.path.startsWith('/tools');
		minecraftOpen.value = route.path.startsWith('/minecraft');
		// 導航列下拉選單：切換路由時自動關閉
		adminOpen.value = false;
		accountOpen.value = false;
    };

	// 在組件加載時檢查路由
    onMounted(() => {
		checkMenus(); // 初始時檢查路由
		
		// 點擊外部關閉下拉選單
		document.addEventListener('click', (e) => {
			const target = e.target;
			if (!target.closest('.nav-dropdown')) {
				adminOpen.value = false;
				accountOpen.value = false;
			}
		});
    });

	// 監聽路由變化
    watch(() => route.path, checkMenus);

    // 切換 Tools 子選單
    const toggleToolsMenu = () => {
		toolsOpen.value = !toolsOpen.value;
    };

    // 切換 Minecraft 子選單
    const toggleMinecraftMenu = () => {
		minecraftOpen.value = !minecraftOpen.value;
    };

    // Admin 選單控制
    const openAdminMenu = () => {
		adminOpen.value = true;
    };
    
    const closeAdminMenu = () => {
		adminOpen.value = false;
    };
    
    const toggleAdminMenu = (e) => {
		e.stopPropagation();
		adminOpen.value = !adminOpen.value;
		accountOpen.value = false; // 關閉其他選單
    };

    // Account 選單控制
    const openAccountMenu = () => {
		accountOpen.value = true;
    };
    
    const closeAccountMenu = () => {
		accountOpen.value = false;
    };
    
    const toggleAccountMenu = (e) => {
		e.stopPropagation();
		accountOpen.value = !accountOpen.value;
		adminOpen.value = false; // 關閉其他選單
    };

    // 在組件加載時調用 getApiVersion
    onMounted(async () => {
      await getApiVersion();  // 獲取 API 版本
    });

    return {
		apiVersion,  // 返回響應式的 version
		route,    // 返回 route 以便在模板中使用
		toolsOpen,
	  	minecraftOpen,
		adminOpen,
		accountOpen,
		toggleToolsMenu,
	  	toggleMinecraftMenu,
		openAdminMenu,
		closeAdminMenu,
		toggleAdminMenu,
		openAccountMenu,
		closeAccountMenu,
		toggleAccountMenu,
	  	uiVersion: __UI_VERSION__,
		currentYear, // 獲取當前年份
    };
  },
};
</script>
