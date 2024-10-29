<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROLES } from '$utils/constants';
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import {
		HomeSolid,
		UserSolid,
		FolderSolid,
		BookmarkSolid,
		ArrowRightToBracketOutline,
		CogSolid,
		ClipboardCheckSolid
	} from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import type { AuthContext } from '../../types';

	const { user } = getContext('authContext') as AuthContext;
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
		{#if $user}
			<div class="flex flex-row gap-2">
				<a href="/user/{$user.username}" class="text-white self-center underline"
					>{$user.username}</a
				>
				<UserSolid class="h-6 w-6 text-white self-center" />
			</div>
		{/if}
		<NavLi class="text-right" on:click={() => goto('/')}
			><Button><HomeSolid class="mr-2" />Pradžia</Button></NavLi
		>
		{#if $user}
			{#if $user.role === ROLES.SUPER_ADMIN}
				<NavLi on:click={() => goto('/super-admin')} class="text-right"
					><Button color="red"><CogSolid /></Button></NavLi
				>{/if}
			{#if $user.role === ROLES.ADMIN || $user.role === ROLES.SUPER_ADMIN}
				<NavLi on:click={() => goto('/review-dashboard')} class="text-right"
					><Button color="purple"><ClipboardCheckSolid class="mr-2" />Peržiūrėti</Button></NavLi
				>
			{/if}
			<NavLi on:click={() => goto('/sources/dashboard')} class="text-right"
				><Button color="green"><FolderSolid class="mr-2" />Šaltiniai</Button></NavLi
			>
			<NavLi on:click={() => goto('/categories/dashboard')} class="text-right"
				><Button color="green"><BookmarkSolid class="mr-2" /> Kategorijos</Button></NavLi
			>
			<NavLi class="text-right" on:click={() => goto('/logout')}
				><Button><ArrowRightToBracketOutline class="mr-2" /> Atsijungti</Button></NavLi
			>
		{:else}
			<NavLi class="text-right" on:click={() => goto('/login')}>
				<Button>🔑 Prisijungti</Button>
			</NavLi>
		{/if}
	</NavUl>
</Navbar>
