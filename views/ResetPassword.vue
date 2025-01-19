<template>
	<div class="header">
		<div class="left">
			<h1>Reset Password</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Reset Password</a></li>
			</ul>
		</div>
	</div>

	<div class="login-container">
		<div class="login-box">
			<form @submit.prevent="resetPassword">
                <div class="form-group"><input v-model="usernameOrEmail" type="text" placeholder="使用者名稱或電子郵件" class="input-field"></div>
				<div class="click-group">
					<div class="form-group checkbox-group">
						<input v-model="isAgreed" type="checkbox" id="privacy-agreement">
						<label for="privacy-agreement">我已閱讀並同意 <a href="#">《隱私條款》</a></label>
					</div>
					<div class="button-login"><button :disabled="!isAgreed" type="submit" class="button">重設密碼</button></div>
					<div class="button-group">
						<button type="button" class="button green button-fornt"><router-link to="/login">登入</router-link></button>
						<button type="button" class="button red button-fornt"><router-link to="/register">註冊</router-link></button>
						<button type="button" class="button blue button-final"><router-link to="#">第三方登入</router-link></button>
					</div>
				</div>
				
			</form>
		</div>
	</div>

	<!-- 漂浮訊息框 -->
	<div v-if="showMessage" class="modal">
		<div class="modal-content">
			<p>{{ message }}</p>
			<button @click="showMessage = false" class="modal-close">關閉</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			usernameOrEmail: '',
			isAgreed: false, // 追蹤是否勾選隱私條款
			showMessage: false,
			message: '',
		};
	},
	methods: {
		// 顯示錯誤訊息的函式
		showError(message) {
			this.message = message;
			this.showMessage = true;
		},

		// 重設密碼的方法
		async resetPassword() {
			if (!this.isAgreed) {
				this.showError('請先閱讀並同意隱私條款');
				return;
			}

			if (!this.usernameOrEmail.trim()) {
				this.showError('請輸入使用者名稱或電子郵件');
				return;
			}

			try {
				// 呼叫 API 重設密碼
				const response = await fetch('/api/reset-password', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						usernameOrEmail: this.usernameOrEmail
					}),
				});

				// 處理 API 回應
				if (response.ok) {  // 使用 response.ok 判斷成功
					this.showError('已發送新密碼到郵件中');
				} else if (response.status === 404) {
					this.showError('未找到使用者名稱或電子郵件');
				} else if (response.status === 400) {
					this.showError('伺服器錯誤，請聯繫管理員');
				} else {
					this.showError('伺服器錯誤，請聯繫管理員');
				}
			} catch (error) {
				this.showError('無法連接伺服器，請稍後再試');
			}
		},
	},
	mounted() {
		document.title = `CoolAPI${this.$route.name ? ` - ${this.$route.name}` : ''}`;
	},
};
</script>

<style scoped src="@/assets/style/auth-pages.css"></style>
