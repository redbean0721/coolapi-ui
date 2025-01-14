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
			<li :class="{ active: route.path === '/status' }"><router-link to="/status"><i class='bx bx-line-chart'></i>Status</router-link></li>
			<!-- <li :class="{ active: route.path === '/minecraft' }"><router-link to="/minecraft"><i class='bx bx-code-alt'></i>Minecraft</router-link></li> -->
			<li @click.prevent="toggleMinecraftMenu"><a href="#"><i class='bx bx-joystick'></i>Minecraft<i class="bx" :class="minecraftOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i></a></li>
			<!-- Minecraft 子選項 -->
			<template v-if="minecraftOpen">
				<li :class="{ active: route.path === '/minecraft/status' }" style="margin-left: 20px;"><router-link to="/minecraft/status"><i class="bx bx-server"></i>Status</router-link></li>
				<li :class="{ active: route.path === '/minecraft/rcon' }" style="margin-left: 20px;"><router-link to="/minecraft/rcon"><i class="bx bx-terminal"></i>RCON</router-link></li>
			</template>
			<li :class="{ active: route.path === '/users' }"><router-link to="/users"><i class='bx bx-group'></i>Users</router-link></li>
			<li :class="{ active: route.path === '/settings' }"><router-link to="/settings"><i class='bx bx-cog'></i>Settings</router-link></li>
		</ul>
		<ul class="side-menu">
			<li>
				<a href="#" class="logout">
					<i class='bx bx-log-in'></i>
					Login
				</a>
			</li>
		</ul>
		<div class="copyright">
			<p>UI Version: {{ uiVersion }}</p>
			<p>版權所有 &copy; 2024</p>
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
	const minecraftOpen = ref(false); // Minecraft 開關

	// 監聽路由變化，根據路由決定 Minecraft 選單是否展開
    const checkMinecraftMenu = () => {
		minecraftOpen.value = route.path.startsWith('/minecraft');
    };

	// 在組件加載時檢查路由
    onMounted(() => {
		checkMinecraftMenu(); // 初始時檢查路由
    });

	// 監聽路由變化
    watch(() => route.path, checkMinecraftMenu);

    // 切換 Minecraft 子選單
    const toggleMinecraftMenu = () => {
		minecraftOpen.value = !minecraftOpen.value;
    };

    // 在組件加載時調用 getApiVersion
    onMounted(async () => {
      await getApiVersion();  // 獲取 API 版本
    });

    return {
		apiVersion,  // 返回響應式的 version
		route,    // 返回 route 以便在模板中使用
	  	minecraftOpen,
	  	toggleMinecraftMenu,
	  	uiVersion: __UI_VERSION__,
    };
  },
};
</script>
