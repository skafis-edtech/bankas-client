<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
</script>

<header><Header /></header>
<main>
	<aside></aside>
	<section><slot /></section>
	<aside></aside>
</main>
<footer><Footer /></footer>

<style lang="scss">
	main {
		display: flex;
		min-height: calc(100vh - 120px);
	}

	section {
		flex: 10 10 0;
		margin-bottom: 20px;
		margin-top: 20px;
	}

	aside {
		flex: 3 3 0;
	}

	header {
		height: 50px;
	}

	footer {
		text-align: center;
	}

	@media screen and (max-width: 768px) {
		aside {
			display: none;
		}
	}
</style>
