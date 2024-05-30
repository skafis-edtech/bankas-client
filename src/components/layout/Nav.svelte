<script lang="ts">
	import { ROUTES } from '$utils/constants';
</script>

<nav>
	{#each ROUTES as route}
		<a href={route.path}>
			{route.name}
		</a>
		<br />
	{/each}
</nav>
