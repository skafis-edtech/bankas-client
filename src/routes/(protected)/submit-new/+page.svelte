<script lang="ts">
	import { currentUser } from '$lib/stores';
	import ProblemCreate from '$components/forms/ProblemCreate.svelte';
	import { Button } from 'flowbite-svelte';
	import CategoryCreate from '$components/forms/CategoryCreate.svelte';
</script>

{#if $currentUser}
	<h1 class="text-4xl font-semibold my-4 text-center">Įkelti naują kategoriją</h1>
	<p class="text-red-600 text-center">Changes are not saved automatically!</p>
	<Button href="/submit-dashboard" class="ml-4">Go back</Button>

	<div class="text-center">
		<CategoryCreate />
		<ProblemCreate />
		<div class="mx-auto mt-8 w-1/2">
			<p>
				By clicking "Submit for review" you confirm that you upload only original problems, created
				by you (which will wave your copyright rights and make it royalty-free) or problems that are
				already royalty-free. It will be reviewed by admins and if it's approved, it will be public
				for everyone to see and use (together with your username, but not email).
			</p>
			<Button class="my-4">Submit for review</Button>
		</div>
	</div>
{:else}
	<p>Unauthorized</p>
{/if}
