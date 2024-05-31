<script lang="ts">
	import { loginUser } from '$services/auth';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';

	async function login() {
		try {
			await loginUser(username, password);
			goto('/');
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
