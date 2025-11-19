<template>
    <div class="header">
		<div class="left">
			<h1>User Management</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">User Management</a></li>
			</ul>
		</div>
		<div class="right">
			<button class="btn-add" @click="openAddUserDialog">
				<i class='bx bx-plus'></i>
				Add User
			</button>
		</div>
    </div>

	<!-- 用戶列表 -->
	<div class="user-management">
		<!-- 搜尋和篩選 -->
		<div class="filter-bar">
			<div class="search-box">
				<i class='bx bx-search'></i>
				<input type="text" v-model="searchQuery" placeholder="Search users by name or email...">
			</div>
			<select v-model="roleFilter" class="role-filter">
				<option value="">All Roles</option>
				<option value="admin">Admin</option>
				<option value="user">User</option>
				<option value="moderator">Moderator</option>
			</select>
		</div>

		<!-- 用戶表格 -->
		<div class="user-table-container">
			<table class="user-table">
				<thead>
					<tr>
						<th>Avatar</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Last Login</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in paginatedUsers" :key="user.id" :class="{ disabled: user.disabled }">
						<td>
							<div class="avatar">
								<img :src="user.avatar" :alt="user.name">
							</div>
						</td>
						<td>
							<div class="user-name">
								<strong>{{ user.name }}</strong>
								<span v-if="user.id === currentUserId" class="badge-me">You</span>
							</div>
						</td>
						<td>{{ user.email }}</td>
						<td>
							<span class="role-badge" :class="'role-' + user.role">
								{{ user.role }}
							</span>
						</td>
						<td>
							<span class="last-login">{{ formatDate(user.lastLogin) }}</span>
						</td>
						<td>
							<label class="toggle-switch">
								<input 
									type="checkbox" 
									v-model="user.disabled"
									@change="toggleUserStatus(user)"
									:disabled="user.id === currentUserId"
								>
								<span class="slider"></span>
								<span class="label">{{ user.disabled ? 'Disabled' : 'Active' }}</span>
							</label>
						</td>
						<td>
							<div class="action-buttons">
								<button class="btn-edit" @click="editUser(user)" :title="'Edit ' + user.name">
									<i class='bx bx-edit'></i>
								</button>
								<button 
									class="btn-delete" 
									@click="deleteUser(user)" 
									:disabled="user.id === currentUserId"
									:title="user.id === currentUserId ? 'Cannot delete yourself' : 'Delete ' + user.name"
								>
									<i class='bx bx-trash'></i>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>

			<!-- 無資料提示 -->
			<div v-if="filteredUsers.length === 0" class="no-data">
				<i class='bx bx-user-x'></i>
				<p>No users found</p>
			</div>
		</div>

		<!-- 分頁 -->
		<div class="pagination">
			<button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
				<i class='bx bx-chevron-left'></i>
			</button>
			<span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
			<button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
				<i class='bx bx-chevron-right'></i>
			</button>
		</div>
	</div>

	<!-- 編輯/新增用戶對話框 -->
	<div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
		<div class="dialog" @click.stop>
			<div class="dialog-header">
				<h3>{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
				<button class="close-btn" @click="closeDialog">
					<i class='bx bx-x'></i>
				</button>
			</div>
			<div class="dialog-body">
				<div class="form-group">
					<label>Name</label>
					<input type="text" v-model="formData.name" placeholder="Enter user name">
				</div>
				<div class="form-group">
					<label>Email</label>
					<input type="email" v-model="formData.email" placeholder="Enter email address">
				</div>
				<div class="form-group">
					<label>Role</label>
					<select v-model="formData.role">
						<option value="user">User</option>
						<option value="moderator">Moderator</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				<div class="form-group" v-if="!isEditing">
					<label>Password</label>
					<input type="password" v-model="formData.password" placeholder="Enter password">
				</div>
				<div class="form-group">
					<label>Avatar URL</label>
					<input type="text" v-model="formData.avatar" placeholder="Enter avatar URL (optional)">
				</div>
			</div>
			<div class="dialog-footer">
				<button class="btn-cancel" @click="closeDialog">Cancel</button>
				<button class="btn-save" @click="saveUser">
					{{ isEditing ? 'Save Changes' : 'Add User' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
	setup() {
		const users = ref([
			{
				id: 1,
				name: 'Admin User',
				email: 'admin@coolapi.com',
				role: 'admin',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-21T10:30:00'),
				disabled: false
			},
			{
				id: 2,
				name: 'John Doe',
				email: 'john@example.com',
				role: 'user',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-20T15:45:00'),
				disabled: false
			},
			{
				id: 3,
				name: 'Jane Smith',
				email: 'jane@example.com',
				role: 'moderator',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-19T09:20:00'),
				disabled: false
			},
			{
				id: 4,
				name: 'Bob Wilson',
				email: 'bob@example.com',
				role: 'user',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-18T14:10:00'),
				disabled: true
			},
			{
				id: 5,
				name: 'Admin User',
				email: 'admin@coolapi.com',
				role: 'admin',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-21T10:30:00'),
				disabled: false
			},
			{
				id: 6,
				name: 'John Doe',
				email: 'john@example.com',
				role: 'user',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-20T15:45:00'),
				disabled: false
			},
			{
				id: 7,
				name: 'Jane Smith',
				email: 'jane@example.com',
				role: 'moderator',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-19T09:20:00'),
				disabled: false
			},
			{
				id: 8,
				name: 'Bob Wilson',
				email: 'bob@example.com',
				role: 'user',
				avatar: '/images/logo.png',
				lastLogin: new Date('2025-10-18T14:10:00'),
				disabled: true
			}
		]);

		const searchQuery = ref('');
		const roleFilter = ref('');
		const currentPage = ref(1);
		const itemsPerPage = 5; // 每頁顯示 5 個用戶
		const currentUserId = ref(1); // 當前登入用戶 ID

		const showDialog = ref(false);
		const isEditing = ref(false);
		const formData = ref({
			id: null,
			name: '',
			email: '',
			role: 'user',
			password: '',
			avatar: '/images/logo.png'
		});

		// 過濾用戶
		const filteredUsers = computed(() => {
			let filtered = users.value;

			// 搜尋過濾
			if (searchQuery.value) {
				const query = searchQuery.value.toLowerCase();
				filtered = filtered.filter(user => 
					user.name.toLowerCase().includes(query) || 
					user.email.toLowerCase().includes(query)
				);
			}

			// 角色過濾
			if (roleFilter.value) {
				filtered = filtered.filter(user => user.role === roleFilter.value);
			}

			return filtered;
		});

		// 當前頁顯示的用戶（分頁後）
		const paginatedUsers = computed(() => {
			const start = (currentPage.value - 1) * itemsPerPage;
			const end = start + itemsPerPage;
			return filteredUsers.value.slice(start, end);
		});

		// 總頁數
		const totalPages = computed(() => {
			return Math.ceil(filteredUsers.value.length / itemsPerPage);
		});

		// 格式化日期
		const formatDate = (date) => {
			if (!date) return 'Never';
			const now = new Date();
			const diff = now - date;
			const minutes = Math.floor(diff / 60000);
			const hours = Math.floor(diff / 3600000);
			const days = Math.floor(diff / 86400000);

			if (minutes < 1) return 'Just now';
			if (minutes < 60) return `${minutes} minutes ago`;
			if (hours < 24) return `${hours} hours ago`;
			if (days < 7) return `${days} days ago`;
			
			return date.toLocaleDateString();
		};

		// 切換用戶狀態
		const toggleUserStatus = (user) => {
			console.log(`User ${user.name} is now ${user.disabled ? 'disabled' : 'active'}`);
			// 這裡可以調用 API 更新用戶狀態
		};

		// 編輯用戶
		const editUser = (user) => {
			isEditing.value = true;
			formData.value = { ...user };
			showDialog.value = true;
		};

		// 刪除用戶
		const deleteUser = (user) => {
			if (user.id === currentUserId.value) {
				alert('You cannot delete yourself!');
				return;
			}
			if (confirm(`Are you sure you want to delete ${user.name}?`)) {
				const index = users.value.findIndex(u => u.id === user.id);
				if (index > -1) {
					users.value.splice(index, 1);
					console.log(`User ${user.name} deleted`);
				}
			}
		};

		// 打開新增用戶對話框
		const openAddUserDialog = () => {
			isEditing.value = false;
			formData.value = {
				id: null,
				name: '',
				email: '',
				role: 'user',
				password: '',
				avatar: '/images/logo.png'
			};
			showDialog.value = true;
		};

		// 關閉對話框
		const closeDialog = () => {
			showDialog.value = false;
		};

		// 儲存用戶
		const saveUser = () => {
			if (!formData.value.name || !formData.value.email) {
				alert('Please fill in all required fields');
				return;
			}

			if (isEditing.value) {
				// 更新現有用戶
				const index = users.value.findIndex(u => u.id === formData.value.id);
				if (index > -1) {
					users.value[index] = { ...formData.value };
				}
			} else {
				// 新增用戶
				const newUser = {
					...formData.value,
					id: Date.now(),
					lastLogin: new Date(),
					disabled: false
				};
				users.value.push(newUser);
			}

			closeDialog();
		};

		// 分頁
		const prevPage = () => {
			if (currentPage.value > 1) currentPage.value--;
		};

		const nextPage = () => {
			if (currentPage.value < totalPages.value) currentPage.value++;
		};

		return {
			users,
			searchQuery,
			roleFilter,
			currentPage,
			currentUserId,
			filteredUsers,
			paginatedUsers,
			totalPages,
			showDialog,
			isEditing,
			formData,
			formatDate,
			toggleUserStatus,
			editUser,
			deleteUser,
			openAddUserDialog,
			closeDialog,
			saveUser,
			prevPage,
			nextPage
		};
	},
	mounted() {
		document.title = `CoolAPI - User Management`;
	}
};
</script>

<style scoped>
.user-management {
	margin-top: 24px;
}

/* Header */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 16px;
}

.btn-add {
	background: var(--primary);
	color: white;
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: all 0.3s ease;
}

.btn-add:hover {
	opacity: 0.9;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* 搜尋和篩選 */
.filter-bar {
	display: flex;
	gap: 16px;
	margin-bottom: 24px;
	flex-wrap: wrap;
}

.search-box {
	flex: 1;
	min-width: 300px;
	position: relative;
	display: flex;
	align-items: center;
	background: var(--light);
	border-radius: 8px;
	padding: 12px 16px;
}

.search-box i {
	color: var(--dark-grey);
	font-size: 20px;
	margin-right: 12px;
}

.search-box input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 14px;
	outline: none;
	color: var(--dark);
}

.role-filter {
	padding: 12px 16px;
	border: none;
	border-radius: 8px;
	background: var(--light);
	color: var(--dark);
	font-size: 14px;
	cursor: pointer;
	outline: none;
}

/* 用戶表格 */
.user-table-container {
	background: var(--light);
	border-radius: 12px;
	overflow-x: auto;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-table {
	width: 100%;
	border-collapse: collapse;
}

.user-table thead {
	background: var(--light);
}

.user-table th {
	padding: 16px;
	text-align: left;
	font-size: 14px;
	font-weight: 600;
	color: var(--dark);
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.user-table td {
	padding: 16px;
	border-top: 1px solid var(--grey);
	color: var(--dark);
}

.user-table tr.disabled {
	opacity: 0.5;
}

.avatar {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	overflow: hidden;
}

.avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.user-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.badge-me {
	background: var(--primary);
	color: white;
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 600;
}

.role-badge {
	padding: 4px 12px;
	border-radius: 16px;
	font-size: 12px;
	font-weight: 600;
	text-transform: capitalize;
}

.role-admin {
	background: var(--light-danger);
	color: var(--danger);
}

.role-moderator {
	background: var(--light-warning);
	color: var(--warning);
}

.role-user {
	background: var(--light-primary);
	color: var(--primary);
}

.last-login {
	color: var(--dark-grey);
	font-size: 14px;
}

/* Toggle Switch */
.toggle-switch {
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;
}

.toggle-switch input {
	display: none;
}

.toggle-switch .slider {
	width: 48px;
	height: 24px;
	background: var(--dark-grey);
	border-radius: 24px;
	position: relative;
	transition: all 0.3s ease;
}

.toggle-switch .slider::before {
	content: '';
	position: absolute;
	width: 20px;
	height: 20px;
	background: white;
	border-radius: 50%;
	top: 2px;
	left: 2px;
	transition: all 0.3s ease;
}

.toggle-switch input:checked + .slider {
	background: var(--success);
}

.toggle-switch input:checked + .slider::before {
	transform: translateX(24px);
}

.toggle-switch input:disabled + .slider {
	opacity: 0.5;
	cursor: not-allowed;
}

.toggle-switch .label {
	font-size: 14px;
	font-weight: 500;
	min-width: 70px;
}

/* 操作按鈕 */
.action-buttons {
	display: flex;
	gap: 8px;
}

.btn-edit,
.btn-delete {
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.btn-edit {
	background: var(--light-primary);
	color: var(--primary);
}

.btn-edit:hover {
	background: var(--primary);
	color: white;
	transform: scale(1.1);
}

.btn-delete {
	background: var(--light-danger);
	color: var(--danger);
}

.btn-delete:hover:not(:disabled) {
	background: var(--danger);
	color: white;
	transform: scale(1.1);
}

.btn-delete:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/* 無資料提示 */
.no-data {
	text-align: center;
	padding: 60px 20px;
	color: var(--dark-grey);
}

.no-data i {
	font-size: 64px;
	margin-bottom: 16px;
}

.no-data p {
	font-size: 18px;
}

/* 分頁 */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	margin-top: 24px;
}

.page-btn {
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 8px;
	background: var(--light);
	color: var(--dark);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
	background: var(--primary);
	color: white;
}

.page-btn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.page-info {
	color: var(--dark);
	font-weight: 500;
}

/* 對話框 */
.dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	animation: fadeIn 0.3s ease;
}

.dialog {
	background: var(--light);
	border-radius: 16px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24px;
	border-bottom: 1px solid var(--grey);
}

.dialog-header h3 {
	margin: 0;
	color: var(--dark);
}

.close-btn {
	width: 32px;
	height: 32px;
	border: none;
	background: transparent;
	color: var(--dark-grey);
	cursor: pointer;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: var(--grey);
	color: var(--dark);
}

.dialog-body {
	padding: 24px;
}

.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: 600;
	color: var(--dark);
}

.form-group input,
.form-group select {
	width: 100%;
	padding: 12px;
	border: 1px solid var(--grey);
	border-radius: 8px;
	font-size: 14px;
	color: var(--dark);
	background: var(--light);
	outline: none;
	transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
	border-color: var(--primary);
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	padding: 24px;
	border-top: 1px solid var(--grey);
}

.btn-cancel,
.btn-save {
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-cancel {
	background: var(--grey);
	color: var(--dark);
}

.btn-cancel:hover {
	background: var(--dark-grey);
	color: white;
}

.btn-save {
	background: var(--primary);
	color: white;
}

.btn-save:hover {
	opacity: 0.9;
	transform: translateY(-2px);
}

/* 響應式設計 */
@media (max-width: 768px) {
	.user-table th,
	.user-table td {
		padding: 12px 8px;
		font-size: 12px;
	}

	.avatar {
		width: 36px;
		height: 36px;
	}

	.toggle-switch .label {
		display: none;
	}

	.dialog {
		width: 95%;
	}
}
</style>