<script lang="ts">
	import { goto } from '$app/navigation';

	export let sourceName: string;

	function handleClick(event: Event) {
		event.preventDefault(); // Prevent the default link behavior
		window.location.href = `/?searchSources=${sourceName}#sources`; // Force a full page reload
	}
</script>

<a href="/?searchSources={sourceName}#sources" on:click={handleClick}>{sourceName}</a>
