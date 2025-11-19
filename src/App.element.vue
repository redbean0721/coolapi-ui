<template>
	<!-- Element Plus 版本的側邊欄和導航 -->
	<el-container class="layout-container">
		<!-- 側邊欄 -->
		<el-aside width="250px" class="sidebar">
			<div class="logo">
				<el-icon><CodeSlash /></el-icon>
				<span class="logo-name"><span>Cool</span>API</span>
			</div>
			
			<!-- API 版本 -->
			<div class="apiVersion">
				<strong>API Version: {{ apiVersion }}</strong>
			</div>

			<!-- 側邊欄選單 -->
			<el-menu
				:default-active="route.path"
				router
				class="el-menu-vertical"
			>
				<el-menu-item index="/">
					<el-icon><HomeFilled /></el-icon>
					<span>Home</span>
				</el-menu-item>

				<el-menu-item index="/image">
					<el-icon><Picture /></el-icon>
					<span>Image</span>
				</el-menu-item>

				<!-- Tools 子選單 -->
				<el-sub-menu index="tools">
					<template #title>
						<el-icon><Tools /></el-icon>
						<span>Tools</span>
					</template>
					<el-menu-item index="/tools/img2pdf">
						<el-icon><Document /></el-icon>
						<span>Img To PDF</span>
					</el-menu-item>
					<el-menu-item index="/tools/remove-bg">
						<el-icon><Picture /></el-icon>
						<span>Remove BG</span>
					</el-menu-item>
				</el-sub-menu>

				<!-- Minecraft 子選單 -->
				<el-sub-menu index="minecraft">
					<template #title>
						<el-icon><VideoPlay /></el-icon>
						<span>Minecraft</span>
					</template>
					<el-menu-item index="/minecraft/status">
						<el-icon><Monitor /></el-icon>
						<span>Status</span>
					</el-menu-item>
					<el-menu-item index="/minecraft/rcon">
						<el-icon><Platform /></el-icon>
						<span>RCON</span>
					</el-menu-item>
				</el-sub-menu>

				<el-menu-item index="/settings">
					<el-icon><Setting /></el-icon>
					<span>Settings</span>
				</el-menu-item>

				<el-menu-item index="/login">
					<el-icon><User /></el-icon>
					<span>Login</span>
				</el-menu-item>
			</el-menu>

			<!-- 版權信息 -->
			<div class="copyright">
				<p>UI Version: {{ uiVersion }}</p>
				<p>版權所有 © {{ currentYear }}</p>
				<strong><a href="https://redbean0721.com" target="_blank">redbean0721.com</a></strong>
			</div>
		</el-aside>

		<!-- 主內容區 -->
		<el-container>
			<!-- 頂部導航欄 -->
			<el-header class="navbar">
				<div class="navbar-left">
					<el-icon class="menu-icon"><Expand /></el-icon>
					<el-input
						v-model="searchText"
						placeholder="Search..."
						class="search-input"
					>
						<template #suffix>
							<el-icon><Search /></el-icon>
						</template>
					</el-input>
				</div>

				<div class="navbar-right">
					<!-- 主題切換 -->
					<el-switch
						v-model="isDark"
						inline-prompt
						:active-icon="Moon"
						:inactive-icon="Sunny"
						@change="toggleTheme"
					/>

					<!-- 通知 -->
					<el-badge :value="12" class="notification">
						<el-icon :size="20"><Bell /></el-icon>
					</el-badge>

					<!-- Admin 下拉選單 -->
					<el-dropdown trigger="hover" @command="handleCommand">
						<span class="el-dropdown-link">
							<el-icon><Shield /></el-icon>
							<span>Admin</span>
							<el-icon class="el-icon--right"><ArrowDown /></el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="/admin/users">
									<el-icon><UserFilled /></el-icon>
									Users
								</el-dropdown-item>
								<el-dropdown-item command="/admin/roles">
									<el-icon><User /></el-icon>
									Roles
								</el-dropdown-item>
								<el-dropdown-item command="/admin/apikeys">
									<el-icon><Key /></el-icon>
									API Keys
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<!-- Account 下拉選單 -->
					<el-dropdown trigger="hover" @command="handleCommand">
						<span class="el-dropdown-link">
							<el-icon><User /></el-icon>
							<span>Account</span>
							<el-icon class="el-icon--right"><ArrowDown /></el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="/account/dashboard">
									<el-icon><DataAnalysis /></el-icon>
									Dashboard
								</el-dropdown-item>
								<el-dropdown-item command="/account/apikey">
									<el-icon><Key /></el-icon>
									API Keys
								</el-dropdown-item>
								<el-dropdown-item command="/account/profile">
									<el-icon><UserFilled /></el-icon>
									Profile
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<!-- 個人頭像 -->
					<el-avatar src="/images/logo.png" />
				</div>
			</el-header>

			<!-- 主要內容 -->
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getApiVersion, apiVersion } from './assets/js/apiVersion';

const route = useRoute();
const router = useRouter();

const searchText = ref('');
const isDark = ref(false);
const currentYear = ref(new Date().getFullYear());
const uiVersion = ref(__UI_VERSION__);

// 載入 API 版本
onMounted(async () => {
	await getApiVersion();
});

// 主題切換
const toggleTheme = () => {
	if (isDark.value) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
};

// 處理下拉選單點擊
const handleCommand = (command) => {
	router.push(command);
};
</script>

<style scoped>
.layout-container {
	height: 100vh;
}

/* 側邊欄樣式 */
.sidebar {
	background: var(--light);
	display: flex;
	flex-direction: column;
	border-right: 1px solid var(--grey);
}

.logo {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 20px;
	font-size: 24px;
	font-weight: bold;
	color: var(--primary);
}

.logo-name span {
	color: var(--dark);
}

.apiVersion {
	padding: 12px 20px;
	font-size: 14px;
	color: var(--dark-grey);
}

.el-menu-vertical {
	border: none;
	flex: 1;
}

.copyright {
	padding: 20px;
	text-align: center;
	font-size: 12px;
	color: var(--dark-grey);
	border-top: 1px solid var(--grey);
}

.copyright p {
	margin: 4px 0;
}

.copyright a {
	color: var(--primary);
	text-decoration: none;
}

/* 導航欄樣式 */
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: var(--light);
	border-bottom: 1px solid var(--grey);
	padding: 0 24px;
}

.navbar-left {
	display: flex;
	align-items: center;
	gap: 16px;
}

.menu-icon {
	font-size: 24px;
	cursor: pointer;
}

.search-input {
	width: 300px;
}

.navbar-right {
	display: flex;
	align-items: center;
	gap: 20px;
}

.el-dropdown-link {
	display: flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	padding: 8px 12px;
	border-radius: 8px;
	transition: all 0.3s;
}

.el-dropdown-link:hover {
	background: var(--grey);
}

.notification {
	cursor: pointer;
}

/* 主內容區 */
.el-main {
	background: var(--grey);
	padding: 24px;
}
</style>
