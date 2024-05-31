<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
	import "../app.css";

	let showModal = false;
</script>

<header><Header /></header>
<main>
	<aside></aside>
	<section><slot /></section>
	<aside></aside>
</main>
<footer><Footer /></footer>

