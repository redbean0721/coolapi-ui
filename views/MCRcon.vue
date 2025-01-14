<template>
    <div class="header">
        <div class="left">
            <h1>MCStatus</h1>
            <ul class="breadcrumb">
                <li><a href="#">CoolAPI</a></li>
                /
                <li><a href="#">Minecraft</a></li>
                /
                <li><a href="#" class="active">Rcon</a></li>
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
                <h4>透過 Minecraft 伺服器自帶的 RCON 協議進行遠程控制</h4>
                <h4><span class="warning">小提醒:</span> 伺服器需事先開啟 <code>RCON</code> 功能才可進行通訊</h4>
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
                        <th>請求類型</th>
						<th>請求位置</th>
                        <th>統計次數</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p>1</p></td>
						<td>POST</td>
                        <td>application/json</td>
						<td><a href="/api/minecraft/rcon">/minecraft/rcon</a></td>
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
                        <td>伺服器 RCON 端口</td>
                        <td>int</td>
                    </tr>
                    <tr>
                        <td><p>3</p></td>
                        <td>password</td>
                        <td>RCON 密碼</td>
                        <td>string</td>
                    </tr>
                    <tr>
                        <td><p>4</p></td>
                        <td>cmd</td>
                        <td>要執行的指令</td>
                        <td>string</td>
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
						<td>status</td>
						<td>執行狀態</td>
                        <td>boolean</td>
					</tr>
					<tr>
						<td><p>2</p></td>
						<td>code</td>
						<td>狀態碼</td>
                        <td>int</td>
					</tr>
					<tr>
						<td><p>3</p></td>
						<td>msg</td>
						<td>命令成功執行後返回的消息</td>
                        <td>string</td>
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