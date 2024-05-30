<script lang="ts">
	import { registerUser } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let username = '';
	let role = 'user'; // Default role, change as necessary
	let errorMessage = '';

	async function register() {
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
		<label for="role">Role:</label>
		<select id="role" bind:value={role}>
			<option value="user">User</option>
			<option value="admin">Admin</option>
		</select>
	</div>
	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}
	<button type="submit">Register</button>
</form>
