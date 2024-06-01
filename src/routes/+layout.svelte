<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
	import '../app.css';

	let showModal = false;
</script>

<header>
	<Header />
	<p class="text-sm">By using this website you agree with Google Analytics cookie usage</p>
</header>
<main>
	<aside></aside>
	<section><slot /></section>
	<aside></aside>
</main>
<footer><Footer /></footer>
