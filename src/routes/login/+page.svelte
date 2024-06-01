<script lang="ts">
	import { loginUser } from '$services/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import { ROLES } from '$utils/constants';

	let username = '';
	let password = '';

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
			await loginUser(username, password);
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
			console.error('Login failed:', error);
		}
	}
</script>

<form on:submit|preventDefault={login}>
	<input bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button type="submit">Login</button>
</form>
<p>Forgot password? Email system admin naglis.suliokas@gmail.com</p>
<p>Don't have an account? <a href="/register">Register</a></p>
