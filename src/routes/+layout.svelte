<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
	import '../app.css';
</script>

<header>
	<Header />
	<p class="text-sm text-center my-2">
		By using this website you agree with Google Analytics cookie usage
	</p>
</header>
<main>
	<aside></aside>
	<section><slot /></section>
	<aside></aside>
</main>
<footer><Footer /></footer>

<style lang="scss">
	header {
		height: 95px;
	}
	footer {
		height: 68px;
		padding: 10px;
		text-align: center;
	}
	main {
		min-height: calc(100vh - 95px - 68px);
		display: flex;
	}
	section {
		flex: 10 10 0;
		background-color: beige;
		padding: 10px;
	}
	aside {
		flex: 3 3 0;
	}
	@media screen and (max-width: 768px) {
		aside {
			display: none;
		}
		header {
			height: fit-content;
		}
	}
</style>
