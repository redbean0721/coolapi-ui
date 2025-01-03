<template>
    <div class="header">
		<div class="left">
			<h1>Home</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Home</a></li>
			</ul>
		</div>
    </div>

	<!-- Insights -->
	<ul class="insights">
		<li>
			<i class='bx bx-calendar-check'></i>
			<span class="info">
				<h3>1,074</h3>
				<p>Paid Order</p>
			</span>
		</li>
		<li>
			<i class='bx bx-show-alt'></i>
			<span class="info">
				<h3>3,944</h3>
				<p>Site Visit</p>
			</span>
		</li>
		<li><i class='bx bx-line-chart'></i>
			<span class="info">
				<h3>14,721</h3>
				<p>Searches</p>
			</span>
		</li>
		<li><i class='bx bx-dollar-circle'></i>
			<span class="info">
				<h3>$6,742</h3>
				<p>Total Sales</p>
			</span>
		</li>
	</ul>
	<!-- End of Insights -->

	<div class="bottom-data">
		<!-- Reminders -->
		<div class="reminders">
			<div class="header">
				<i class='bx bx-note'></i>
				<!-- <i class='bx bxs-megaphone' ></i> -->
				<h3>Site Announcement</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-plus'></i>
			</div>
			<ul class="task-list">
				<li class="alert-critical">
					<div class="task-title">
						<i class='bx bx-check-circle'></i>
						<p>Emergency Notice: System Maintenance in Progress!</p>
					</div>
					<i class='bx bx-dots-vertical-rounded'></i>
				</li>
				<li class="alert-caution">
					<div class="task-title">
						<i class='bx bx-check-circle'></i>
						<p>Reminder: Upcoming Version Update.</p>
					</div>
					<i class='bx bx-dots-vertical-rounded'></i>
				</li>
				<li class="alert-info">
					<div class="task-title">
						<i class='bx bx-x-circle'></i>
						<p>Update Successful: Features are Now Live.</p>
					</div>
					<i class='bx bx-dots-vertical-rounded'></i>
				</li>
			</ul>
		</div>

		<div class="orders">
			<div class="header">
				<!-- <i class='bx bx-receipt'></i> -->
				<i class='bx bxs-bar-chart-alt-2'></i>
				<h3>API Counters</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<table>
				<thead>
					<tr>
						<th>Counter Name</th>
						<th>Last updated</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<!-- <img src="/images/profile-1.jpg"> -->
							<p>Random Image</p>
						</td>
						<td>2024-12-31 16:44:59</td>
						<!-- <td><span class="status completed">Completed</span></td> -->
						<td><span>3896</span></td>
					</tr>
					<tr>
						<td>
							<!-- <img src="/images/profile-1.jpg"> -->
							<p>Minecraft API</p>
						</td>
						<td>2024-05-14 23:51:40</td>
						<!-- <td><span class="status pending">Pending</span></td> -->
						<td><span>0</span></td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="orders">
			<div class="header">
				<i class='bx bx-receipt'></i>
				<h3>Recent Orders</h3>
				<i class='bx bx-filter'></i>
				<i class='bx bx-search'></i>
			</div>
			<table>
				<thead>
					<tr>
						<th>User</th>
						<th>Order Date</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<img src="/images/profile-1.jpg">
							<p>John Doe</p>
						</td>
						<td>14-08-2023</td>
						<td><span class="status completed">Completed</span></td>
					</tr>
					<tr>
						<td>
							<img src="/images/profile-1.jpg">
							<p>John Doe</p>
						</td>
						<td>14-08-2023</td>
						<td><span class="status pending">Pending</span></td>
					</tr>
					<tr>
						<td>
							<img src="/images/profile-1.jpg">
							<p>John Doe</p>
						</td>
						<td>14-08-2023</td>
						<td><span class="status process">Processing</span></td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- End of Reminders-->
	</div>
</template>

<style scoped>
html {
    overflow: -moz-hidden-unscrollable;
    height: 100%;
}

body::-webkit-scrollbar {
    display: none;
}

body {
    -ms-overflow-style: none;
    height: 100%;
	width: calc(100vw + 18px);
	overflow: auto;
}

.content main .bottom-data .reminders {
  	flex-basis: 100%; /* 這樣讓 reminders 佔據一整行 */
}
</style>

<script>
export default {
	mounted() {
		document.title = `CoolAPI`;
	}
};
</script>