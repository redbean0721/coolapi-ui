<template>
<div class="header">
    <div class="left">
        <h1>Minecraft</h1>
        <ul class="breadcrumb">
            <li><a href="#">CoolAPI</a></li>
            /
            <li><a href="#" class="active">Minecraft</a></li>
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