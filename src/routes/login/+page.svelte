<script lang="ts">
	import { loginUser } from '$lib/auth';
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

<input bind:value={username} placeholder="Username" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={login}>Login</button>
<p>Forgot password? Email system admin naglis.suliokas@gmail.com</p>
