<template>
	<div class="header">
		<div class="left">
		<h1>Image</h1>
		<ul class="breadcrumb">
			<li><a href="#">CoolAPI</a></li>
			/
			<li><a href="#" class="active">Image</a></li>
		</ul>
		</div>
	</div>

	<div class="bottom-data">
		<!-- Reminders -->
		<div class="reminders">
			<div class="header">
				<i class='bx bx-note title'></i>
				<h3 class="title">API 簡介</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-plus'></i>
				<h4>此 API 提供隨機圖片功能, 並且不定時更新!</h4>
				<h4>所有圖片均來自網上, 如果侵犯了您的權利, 請連絡我刪除</h4>
				<h4><span class="warning">警告:</span> 請勿使用爬蟲等工具直接請求 <code>/img</code> !</h4>
			</div>
		</div>

		<div class="orders">
			<div class="header">
				<i class='bx bx-link title'></i>
				<h3 class="title">API 位置</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>適用設備</th>
						<th>請求方式</th>
						<th>請求位置</th>
						<th>統計次數</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p>1</p></td>
						<td>電腦</td>
						<td>GET</td>
						<td><a href="/api/img">/img</a></td>
						<td><span>{{ counterData['random_pic'] ?? (isLoading ? 'loading...' : 'undefined') }}</span></td>
					</tr>
					<tr>
						<td><p>2</p></td>
						<td>手機</td>
						<td>GET</td>
						<td><a href="/api/img-phone">/img-phone</a></td>
						<td><span>{{ counterData['mcstatus'] ?? (isLoading ? 'loading...' : 'undefined') }}</span></td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="orders">
			<div class="header">
				<i class='bx bx-key title'></i>
				<h3 class="title">參數列表</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>參數</th>
						<th>說明</th>
                        <th>資料類型</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p>1</p></td>
						<td>type</td>
						<td>填 <code>json</code> 則返回一串數據, 不填則返回一張圖片</td>
						<td>string</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="orders">
			<div class="header">
				<i class='bx bx-redo title'></i>
				<h3 class="title">返回數據 (類型使用 json)</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>數據</th>
						<th>說明</th>
                        <th>資料類型</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p>1</p></td>
						<td>id</td>
						<td>圖片 ID</td>
						<td>int</td>
					</tr>
					<tr>
						<td><p>2</p></td>
						<td>fileName</td>
						<td>檔案名稱</td>
						<td>string</td>
					</tr>
					<tr>
						<td><p>3</p></td>
						<td>url</td>
						<td>圖床位置</td>
						<td>string</td>
					</tr>
					<tr>
						<td><p>4</p></td>
						<td>size</td>
						<td>圖片大小 (mb)</td>
						<td>float</td>
					</tr>
					<tr>
						<td><p>5</p></td>
						<td>tag</td>
						<td>檔案名稱</td>
						<td>string</td>
					</tr>
					<tr>
						<td><p>6</p></td>
						<td>updateAt</td>
						<td>上傳日期 (Unix timestamp)</td>
						<td>int</td>
					</tr>
					<tr>
						<td><p>7</p></td>
						<td>origin</td>
						<td>圖片來源</td>
						<td>string</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="orders">
			<div class="header">
				<i class='bx bx-cloud-upload' ></i>
				<h3>最新上傳</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<!-- <h1>後端還沒做好:)</h1> -->
			<div class="image-grid">
				<!-- <img v-for="(image, index) in images" :key="index" :src="image" alt="最新上傳圖片"> -->
				 <img v-for="image in images" :key="image.id" :src="image.url" :alt="image.fileName || '最新上傳圖片'">
			</div>
		</div>
		<!-- End of Reminders-->
	</div>
</template>

<script>
export default {
	data() {
		return {
			counterData: {}, // 用於存儲統計次數
			isLoading: true, // 用於追踪加載狀態
			images: [],
		};
	},
	methods: {
		async fetchApiData() {
			try {
				// 替換為你的 API 地址
				const response = await fetch("https://api.redbean0721.com/api/status");
				const data = await response.json();

				// 提取 counter 數據並轉換為鍵值對
				this.counterData = data.counter.reduce((acc, item) => {
					acc[item.name] = item.count;
					return acc;
				}, {});
			} catch (error) {
				console.error("API 請求失敗：", error);
			} finally {
				// 加載完成
				this.isLoading = false;
			}
		},
		async fetchLatestImages() {
			// 可以為圖片列表設置單獨的加載狀態，如果需要的話
			// this.isImagesLoading = true;
			try {
				const response = await fetch("https://api.redbean0721.com/api/img/list?page=1&pageSize=12");
				const data = await response.json();
				if (data && data.status && data.data && data.data.imgs) {
					this.images = data.data.imgs; // 假設 API 返回的圖片數據在 data.data.imgs 中
				} else {
					console.error("獲取圖片列表失敗或數據格式不正確:", data);
					this.images = []; // 清空或設置預設圖片
				}
			} catch (error) {
				console.error("最新上傳圖片 API 請求失敗：", error);
				this.images = []; // 清空或設置預設圖片
			} finally {
				// this.isImagesLoading = false;
			}
		}
	},
	mounted() {
		// 頁面加載時請求 API 數據
		this.fetchApiData(); // 獲取狀態數據
		this.fetchLatestImages(); // 新增：獲取最新上傳的圖片
	},
};
</script>

<style scoped>
.reminders .header {
	display: flex; /* 使用 flex 排版 */
	flex-wrap: wrap; /* 允許子元素換行 */
	align-items: center; /* 垂直對齊 */
}

.bottom-data .reminders {
  	flex-basis: 100%; /* 這樣讓 reminders 佔據一整行 */
}

.title {
	margin-bottom: 10px;
}

.reminders .header h4 {
	display: block; /* 確保每個 h4 獨占一行 */
	flex-basis: 100%; /* 讓 h4 占滿整行 */
	margin-top: -5px;
	margin-left: 50px;
}

main .bottom-data .orders {
  	flex-basis: 100%; /* 這樣讓 orders 佔據一整行 */
}

.image-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr); /* 每行 3 張圖片 */
	gap: 10px; /* 圖片之間的間距 */
}

.image-grid img {
	width: 95%;
	height: auto;
	border-radius: 8px; /* 圖片圓角 */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影效果 */
}
</style>