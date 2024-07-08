<script lang="ts">
	import { goto } from '$app/navigation';
	import { Accordion, Button } from 'flowbite-svelte';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių pateikimas</h1>
<Button on:click={() => goto('/submit-new-source')}>Pridėti užduočių rinkinį (šaltinį)</Button>
