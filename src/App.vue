<template>
	<!-- Sidebar -->
	<div class="sidebar">
		<a href="#" class="logo">
			<i class='bx bx-code-alt'></i>
			<div class="logo-name"><span>Cool</span>API</div>
		</a>
		<!-- 顯示 API 版本 -->
		<div class="apiVersion">
			<strong><p>Version: {{ version }}</p></strong>
		</div>
		<ul class="side-menu">
			<li :class="{ active: route.path === '/' }"><router-link to="/"><i class='bx bxs-home'></i>Home</router-link></li>
			<li :class="{ active: route.path === '/image' }"><router-link to="/image"><i class='bx bxs-image'></i>Image</router-link></li>
			<li :class="{ active: route.path === '/status' }"><router-link to="/status"><i class='bx bx-line-chart'></i>Status</router-link></li>
			<li :class="{ active: route.path === '/command' }"><router-link to="/command"><i class='bx bx-code-alt'></i>Command</router-link></li>
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
import { getApiVersion, version } from './assets/js/apiVersion';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();  // 獲取當前路由

    // 在組件加載時調用 getApiVersion
    onMounted(async () => {
      await getApiVersion();  // 獲取 API 版本
    });

    return {
      version,  // 返回響應式的 version
      route,    // 返回 route 以便在模板中使用
    };
  },
};
</script>

<style scoped>
.sidebar .apiVersion {
    color: var(--dark);
    text-align: center;
    transition: all 0.3s ease;
	margin-top: -15px;
	margin-left: -15px;
	margin-bottom: -2.5px;
}
</style>
