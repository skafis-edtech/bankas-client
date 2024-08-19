<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROLES } from '$utils/constants';
	import { Button, CloseButton, Drawer, NavBrand, Navbar } from 'flowbite-svelte';
	import { BarsOutline, HomeSolid, UserSolid } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import type { AuthContext } from '../../types';
	import { sineIn } from 'svelte/easing';

	const { user } = getContext('authContext') as AuthContext;

	function popup() {
		alert(
			'Susisiekite info@skafis.lt, jei norite tapti administratoriumi ir peržiūrėti kitų pateiktas užduotis.'
		);
	}

	let hidden1 = true;
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};
</script>

<Navbar class="dark bg-gray-800 ">
	<NavBrand href="/">
		<img src="/favicon-32x32.png" class="me-3 h-6 sm:h-9" alt="logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Skafis užduočių bankas</span
		>
	</NavBrand>
	<Button on:click={() => (hidden1 = false)}><BarsOutline /></Button>
	<Drawer
		transitionType="fly"
		{transitionParams}
		bind:hidden={hidden1}
		id="sidebar1"
		placement="right"
	>
		<CloseButton on:click={() => (hidden1 = true)} class="mb-4 dark:text-white" />
		<div class="flex flex-col gap-2">
			{#if $user}
				<div class="flex flex-row gap-2">
					<a
						href="/user/{$user.username}"
						on:click={() => (hidden1 = true)}
						class="text-white self-center underline">{$user.username}</a
					>
					<UserSolid class="h-6 w-6 text-white self-center" />
				</div>
			{/if}
			<Button
				on:click={() => {
					hidden1 = true;
					goto('/');
				}}><HomeSolid class="mr-2" />Pradžia</Button
			>
			{#if $user}
				{#if $user.role === ROLES.SUPER_ADMIN}
					<Button
						on:click={() => {
							hidden1 = true;
							goto('/super-admin');
						}}
						color="red">Kategorijos</Button
					>
				{/if}
				{#if $user.role === ROLES.ADMIN || $user.role === ROLES.SUPER_ADMIN}
					<Button
						on:click={() => {
							hidden1 = true;
							goto('/review-dashboard');
						}}
						color="purple">Peržiūrėti</Button
					>
				{:else}
					<Button
						on:click={() => {
							hidden1 = true;
							popup();
						}}
						color="light">Peržiūrėti</Button
					>
				{/if}
				<Button
					on:click={() => {
						hidden1 = true;
						goto('/submit/dashboard');
					}}
					color="green">Pateikti</Button
				>
				<!-- <Button
					on:click={() => {
						hidden1 = true;
						goto('/sort-dashboard');
					}}
					color="blue">Rūšiuoti</Button
				> -->
				<Button
					on:click={() => {
						hidden1 = true;
						goto('/logout');
					}}>Atsijungti</Button
				>
			{:else}
				<Button
					on:click={() => {
						hidden1 = true;
						goto('/login');
					}}>Prisijungti</Button
				>
			{/if}
		</div>
	</Drawer>
</Navbar>
