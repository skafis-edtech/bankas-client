<script lang="ts">
	import { loginUser } from '$services/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import { ROLES } from '$utils/constants';
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let username = writable('');
	let password = writable('');
	let errorMessage = writable('');

	onMount(() => {
		const unsubscribe = currentUser.subscribe(async (userState) => {
			if (userState && userState.username) {
				if (userState.role === ROLES.ADMIN) {
					await goto('/review-dashboard');
				} else if (userState.role === ROLES.USER) {
					await goto('/submit-dashboard');
				} else {
					throw new Error('Unknown role' + userState.role);
				}
			}
		});

		return () => unsubscribe();
	});

	async function login() {
		try {
			await loginUser($username, $password);
			currentUser.subscribe((user) => {
				if (user && user.username) {
					if (user.role === ROLES.ADMIN) {
						goto('/review-dashboard');
					} else if (user.role === ROLES.USER) {
						goto('/submit-dashboard');
					} else {
						throw new Error('Unknown role' + user.role);
					}
				}
			});
		} catch (error) {
			errorMessage.set('Login failed. Please check your credentials.');
		}
	}
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">Login</h2>
	<form on:submit|preventDefault={login} class="space-y-6">
		<div>
			<Label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Username
			</Label>
			<Input
				id="username"
				type="text"
				bind:value={$username}
				placeholder="Username"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Password
			</Label>
			<Input
				id="password"
				type="password"
				bind:value={$password}
				placeholder="Password"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		{#if $errorMessage}
			<p class="text-red-600">{$errorMessage}</p>
		{/if}
		<Button type="submit" class="w-full py-2 text-lg">Login</Button>
	</form>
	<Helper class="mt-4 text-center">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Forgot password? Email system's admin
			<a
				href="mailto:naglis.suliokas@gmail.com"
				class="text-blue-600 hover:underline dark:text-blue-400"
			>
				naglis.suliokas@gmail.com
			</a>
		</p>
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Don't have an account?
			<a href="/register" class="text-blue-600 hover:underline dark:text-blue-400">Register</a>
		</p>
	</Helper>
</div>
