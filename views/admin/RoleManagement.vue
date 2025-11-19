<template>
    <div class="header">
		<div class="left">
			<h1>Role Management</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Role Management</a></li>
			</ul>
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