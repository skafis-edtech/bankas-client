<script lang="ts">
	export let author: string;

	function handleClick(event: Event) {
		event.preventDefault(); // Prevent the default link behavior
		window.location.href = `/user/${author}`; // Force a full page reload
	}
</script>

<a href="/user/{author}" on:click={handleClick}>{author}</a>
