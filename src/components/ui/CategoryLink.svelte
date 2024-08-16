<script lang="ts">
	import { goto } from '$app/navigation';

	export let categoryName: string;

	function handleClick(event: Event) {
		event.preventDefault(); // Prevent the default link behavior
		window.location.href = `/?searchCategories=${categoryName}#categories`; // Force a full page reload
	}
</script>

<a href="/?searchCategories={categoryName}#categories" on:click={handleClick}>{categoryName}</a>
