<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ROLES } from '$utils/constants';
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import { derived } from 'svelte/store';
	import type { AuthContext } from '../../types';
	import { page } from '$app/stores';

	let username = '';
	let password = '';
	let errorMessage = '';

	const { user, login } = getContext('authContext') as AuthContext;

	const redirectUrl: string | null = $page.url.searchParams.get('redirect');

	const userLoaded = derived(user, ($user, set) => {
		if ($user) {
			set($user);
		}
	});

	const redirectLoggedInUser = () => {
		if ($user) {
			if (redirectUrl) {
				goto(redirectUrl);
			} else if ($user.role === ROLES.ADMIN) {
				goto('/review-dashboard');
			} else if ($user.role === ROLES.USER) {
				goto('/submit-dashboard');
			} else if ($user.role === ROLES.SUPER_ADMIN) {
				goto('/super-admin');
			} else {
				throw new Error('Unknown role: ' + $user.role);
			}
		}
	};

	onMount(() => {
		userLoaded.subscribe(() => {
			redirectLoggedInUser();
		});
	});

	async function handleLogin() {
		try {
			console.log('Attempting login...');
			await login(username, password);
			userLoaded.subscribe(($user) => {
				if ($user) {
					console.log('User logged in:', $user);
					redirectLoggedInUser();
				}
			});
		} catch (error) {
			console.error('Login failed:', error);
			errorMessage = 'Prisijungimas nesėkmingas. Bandykite dar kartą.';
		}
	}
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
		Prisijungimas
	</h2>
	<form on:submit|preventDefault={handleLogin} class="space-y-6">
		<div>
			<Label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Prisijungimo vardas
			</Label>
			<Input
				id="username"
				type="text"
				bind:value={username}
				placeholder="Prisijungimo vardas"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Slaptažodis
			</Label>
			<Input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Slaptažodis"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		{#if errorMessage}
			<p class="text-red-600">{errorMessage}</p>
		{/if}
		<Button type="submit" class="w-full py-2 text-lg">Prisijungti</Button>
	</form>
	<Helper class="mt-4 text-center">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Pamiršote slaptažodį? Parašykite el. paštu sistemos administratoriui
			<a
				href="mailto:naglis.suliokas@gmail.com"
				class="text-blue-600 hover:underline dark:text-blue-400"
			>
				naglis.suliokas@gmail.com
			</a>
		</p>
		<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
			Neturite paskyros?
			<a href="/register" class="text-blue-600 hover:underline dark:text-blue-400">Registracija</a>
		</p>
	</Helper>
</div>
