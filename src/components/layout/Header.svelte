<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores';
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import { HomeSolid, UserSolid } from 'flowbite-svelte-icons';
</script>

<Navbar class="dark bg-gray-800 ">
	<NavBrand href="/">
		<img src="/favicon-32x32.png" class="me-3 h-6 sm:h-9" alt="logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Skafis užduočių bankas</span
		>
	</NavBrand>
	<NavHamburger class="text-white" />
	<NavUl class="flex-nowrap items-center m0p0-inside-ul">
		{#if $currentUser}
			<div class="flex flex-row gap-2 mx-4 mt-3">
				<p class="text-white">{$currentUser.username}</p>
				<UserSolid class="h-6 w-6 text-white" />
			</div>
		{/if}
		<NavLi class="text-right" on:click={() => goto('/')}
			><Button><HomeSolid class="mr-2" />Pradžia</Button></NavLi
		>
		{#if $currentUser}
			{#if $currentUser.role === 'admin'}
				<NavLi on:click={() => goto('/review-dashboard')} class="text-right"
					><Button>Peržiūrėti</Button></NavLi
				>
			{/if}
			<NavLi on:click={() => goto('/submit-dashboard')} class="text-right"
				><Button>Pateikti</Button></NavLi
			>
			<NavLi class="text-right" on:click={() => goto('/logout')}><Button>Logout</Button></NavLi>
		{:else}
			<NavLi class="text-right" on:click={() => goto('/login')}>
				<Button>Prisijungti</Button>
			</NavLi>
		{/if}
	</NavUl>
</Navbar>

<style>
	:global(.m0p0-inside-ul ul) {
		@apply p-0 m-0;
	}
</style>
