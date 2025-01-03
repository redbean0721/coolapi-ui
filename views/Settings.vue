<template>
	<div class="header">
		<div class="left">
			<h1>Settings</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Settings</a></li>
			</ul>
		</div>

		<div class="bottom-data">
			<div class="orders">
				<div class="header">
					<i class='bx bx-receipt'></i>
					<h3>Website Settings</h3>
					<i class='bx bx-filter'></i>
					<i class='bx bx-search'></i>
				</div>
				<!-- 新增清除快取和localStorage的按鈕 -->
				<div class="clear-cache-btn">
					<button @click="clearCacheAndLocalStorage">Clear Site Data and Cache</button>
				</div>
			</div>
		</div>
	</div>
</template>

<!-- <script>
export default {
	methods: {
		// 清除快取和localStorage的操作
		clearCacheAndLocalStorage() {
		// 清除localStorage
		localStorage.clear();

		// 清除快取
		if (caches) {
			caches.keys().then(cacheNames => {
				cacheNames.forEach(cacheName => {
					caches.delete(cacheName);
				});
			});
		}

		// 可以根據需求顯示提示訊息
		alert('Cache and LocalStorage cleared!');
		}
	}
}
</script> -->

<script>
export default {
	methods: {
		async clearCacheAndLocalStorage() {
			localStorage.clear();	// 清除 localStorage
			sessionStorage.clear();	// 清除 sessionStorage

			// 清除 Cache Storage (針對支援 caches API 的瀏覽器)
			if ('caches' in window) {
				try {
					const cacheNames = await caches.keys();
					await Promise.all(cacheNames.map(cache => caches.delete(cache)));
					console.log('Cache Storage cleared.');
				} catch (error) {
					console.error('Error clearing Cache Storage:', error);
				}
			} else {
				console.warn('Cache API not supported.');
			}

			// 清除 IndexedDB (兼容 Firefox 和其他瀏覽器)
			const databases = await indexedDB.databases();
			for (const db of databases) {
				if (db.name) {
					await indexedDB.deleteDatabase(db.name);
					console.log(`IndexedDB ${db.name} deleted.`);
				}
			}

			// 清除 cookies
			document.cookie.split(';').forEach(cookie => {
				document.cookie = cookie
					.replace(/^ +/, '')
					.replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
			});

			// 提示完成訊息
			alert('Cache, LocalStorage, and Cookies cleared!');
		},
	},


	mounted() {
		document.title = `CoolAPI${this.$route.name ? ` - ${this.$route.name}` : ''}`;
	}
}
</script>

<style scoped>
.header {
	display: flex;
	/* flex-direction: column; */
	align-items: flex-start;
	padding-bottom: 20px;
}

/* 按鈕容器的樣式，添加上邊距來與上方標題區隔 */
.clear-cache-btn {
	margin-top: 40px; /* 調整這裡的數值來控制距離 */
	margin-bottom: 60px;
	padding-left: 43%;
}

/* 按鈕樣式 (可自定義) */
.clear-cache-btn button {
	padding: 10px 20px;
	background-color: #f44336;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

.clear-cache-btn button:hover {
	background-color: #d32f2f;
}
</style>