<template>
    <div class="header">
		<div class="left">
			<h1>Image Background Removal</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Remove BG</a></li>
			</ul>
		</div>
    </div>

    <div class="bottom-data"><h1>Zzz...</h1></div>
</template>

<script>
export default {
	mounted() {
		document.title = `CoolAPI${this.$route.name ? ` - ${this.$route.name}` : ''}`;
	}
};
</script>