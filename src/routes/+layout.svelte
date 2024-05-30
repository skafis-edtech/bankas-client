<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
	import Nav from '$components/layout/Nav.svelte';
</script>

<Header />
<Nav />
<slot />
<Footer />
