<script lang="ts">
	import { registerUser } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let username = '';
	let role = 'user';
	let errorMessage = '';
	let terms = false;

	async function register() {
		if (!terms) {
			errorMessage = 'You must agree to the terms';
			return;
		}
		try {
			await registerUser(email, password, username, role);
			goto('/');
		} catch (error: any) {
			console.error('Registration failed:', error);
			errorMessage = error.message;
		}
	}
</script>

<h1>Register</h1>
<p>For admin(being able to approve other's uploads) - email naglis.suliokas@gmail.com</p>
<form on:submit|preventDefault={register}>
	<div>
		<label for="email">Email:</label>
		<input type="email" id="email" bind:value={email} required />
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="password" id="password" bind:value={password} required />
	</div>
	<div>
		<label for="username">Username:</label>
		<input type="text" id="username" bind:value={username} required />
	</div>
	<div>
		<label for="terms"
			>I agree that all my email will be used for communicating with system admin, I agree that my
			username, uploaded problems and problem meta data will be public for everyone to see</label
		>
		<input type="checkbox" id="terms" required bind:checked={terms} />
	</div>
	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}
	<button type="submit">Register</button>
</form>
