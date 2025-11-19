<template>
	<div class="header">
		<div class="left">
			<h1>Register</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Register</a></li>
			</ul>
		</div>
	</div>

	<div class="login-container">
		<div class="login-box">
			<form @submit.prevent="register">
                <div class="form-group"><input v-model="username" type="text" placeholder="使用者名稱" class="input-field"></div>
				<div class="form-group"><input v-model="email" type="text" placeholder="電子郵件" class="input-field"></div>
				<div class="form-group"><input v-model="password" type="password" placeholder="密碼" class="input-field"></div>
				<div class="form-group"><input v-model="confirmPassword" type="password" placeholder="確認密碼" class="input-field"></div>
				<div class="click-group">
					<div class="form-group checkbox-group">
						<input v-model="isAgreed" type="checkbox" id="privacy-agreement">
						<label for="privacy-agreement">我已閱讀並同意 <a href="#">《隱私條款》</a></label>
					</div>
					<!-- <div class="button-login"><button :disabled="!isAgreed" type="submit" class="button">註冊</button></div> -->
					<div class="button-login"><button :disabled="!isAgreed" type="submit" class="button">註冊</button></div>
					<div class="button-group">
						<button type="button" class="button green button-fornt"><router-link to="/login">登入</router-link></button>
						<button type="button" class="button red button-fornt"><router-link to="/reset-password">忘記密碼</router-link></button>
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
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
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

		// 註冊的方法
		async register() {
			if (!this.isAgreed) {
				this.showError('請先閱讀並同意隱私條款');
				return;
			}

			if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
				this.showError('請填寫所有欄位');
				return;
			}

			if (this.password !== this.confirmPassword) {
				this.showError('密碼與確認密碼不一致');
				return;
			}

			try {
				// 呼叫 API 註冊
				const response = await fetch('/api/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: this.username,
						email: this.email,
						password: this.password,
					}),
				});

				// 處理 API 回應
				if (response.ok) {  // 使用 response.ok 判斷成功
					this.showError('註冊成功');
				} else if (response.status === 400) {
					this.showError('註冊失敗，請確認資料正確');
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
