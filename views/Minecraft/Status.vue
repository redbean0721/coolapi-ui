<template>
    <div class="header">
        <div class="left">
            <h1>MCStatus</h1>
            <ul class="breadcrumb">
                <li><a href="#">CoolAPI</a></li>
                /
                <li><a href="#">Minecraft</a></li>
                /
                <li><a href="#" class="active">Status</a></li>
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
                <h4>支持查詢 <code>Java (伺服器版本需大於等於 1.7)</code> 與 <code>Bedrock</code> 類型伺服器</h4>
                <h4>如果伺服器開啟 <code>Query</code> 則可查看帶有 <code>*</code> 之參數</h4>
                <h4>使用 <code>Cloudflare</code> 查詢 <code>SRV</code> 解析</h4>
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
						<th>請求方式</th>
						<th>請求位置</th>
                        <th>統計次數</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p>1</p></td>
						<td>GET</td>
						<td><a href="/api/minecraft/status/java">/minecraft/status/java</a></td>
                        <td>Null</td>
					</tr>
                    <tr>
						<td><p>2</p></td>
						<td>GET</td>
						<td><a href="/api/minecraft/status/bedrock">/minecraft/status/bedrock</a></td>
                        <td>Null</td>
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
						<td>host</td>
						<td>伺服器連線位置</td>
                        <td>string</td>
					</tr>
                    <tr>
                        <td><p>2</p></td>
                        <td>port</td>
                        <td>伺服器端口</td>
                        <td>int</td>
                    </tr>
				</tbody>
			</table>
		</div>

        <div class="orders">
			<div class="header">
				<i class='bx bx-redo title'></i>
				<h3 class="title">返回數據</h3>
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
						<td>online</td>
						<td>伺服器狀態</td>
                        <td>boolean</td>
					</tr>
					<tr>
						<td><p>2</p></td>
						<td>host</td>
						<td>伺服器IP</td>
                        <td>string</td>
					</tr>
					<tr>
						<td><p>3</p></td>
						<td>port</td>
						<td>伺服器端口</td>
                        <td>int</td>
					</tr>
                    <tr>
						<td><p>4</p></td>
						<td>version</td>
						<td>伺服器版本</td>
                        <td>string</td>
					</tr>
                    <tr>
                        <td>5</td>
                        <td>players</td>
                        <td>包含玩家相關數據的物件</td>
                        <td>object</td>
                    </tr>
					<tr>
						<td></td>
						<td>online</td>
						<td>在線玩家數</td>
                        <td>int</td>
					</tr>
                    <tr>
						<td></td>
						<td>max</td>
						<td>允許最大玩家數</td>
                        <td>int</td>
					</tr>
                    <tr>
						<td></td>
						<td>list</td>
						<td>玩家列表</td>
                        <td>array</td>
					</tr>
                    <tr>
						<td><p>6</p></td>
						<td>motd</td>
						<td>伺服器 MOTD</td>
                        <td>string</td>
					</tr>
                    <tr>
						<td><p>7</p></td>
						<td>latency</td>
						<td>伺服器延遲 (ms)</td>
                        <td>float</td>
					</tr>
                    <tr>
						<td><p>8</p></td>
						<td>icon</td>
						<td>伺服器圖標 (Base64)</td>
                        <td>string</td>
					</tr>
                    <tr>
						<td><p>9</p></td>
						<td>plugins*</td>
						<td>伺服器插件</td>
                        <td>array</td>
					</tr>
                    <tr>
						<td><p>10</p></td>
						<td>mods*</td>
						<td>伺服器模組</td>
                        <td>array</td>
					</tr>
                    <tr>
						<td><p>11</p></td>
						<td>software*</td>
						<td>伺服器核心</td>
                        <td>string</td>
					</tr>
                    <tr>
						<td><p>12</p></td>
						<td>map*</td>
						<td>伺服器地圖</td>
                        <td>string</td>
					</tr>
                    <tr>
                        <td>13</td>
                        <td>query_time</td>
                        <td>請求時間 (Unix timestamp)</td>
                        <td>int</td>
                    </tr>
				</tbody>
			</table>
		</div>
    </div>
</template>

<script>
export default {
	mounted() {
		document.title = `CoolAPI${this.$route.name ? ` - ${this.$route.name}` : ''}`;
	}
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
</style>