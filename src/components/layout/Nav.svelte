<script lang="ts">
	import { routes } from '$utils/routes';
</script>

<nav>
	{#each routes as route}
		<a href={route.path}>
			{route.name}
		</a>
		<br />
	{/each}
</nav>
