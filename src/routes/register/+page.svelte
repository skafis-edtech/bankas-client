<script lang="ts">
	import { registerUser } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let username = '';
	let role = 'user';
	let errorMessage = '';
	let terms = false;
	let recaptchaVerified = false;
	let recaptchaToken = '';

	async function register() {
		if (!recaptchaVerified) {
			errorMessage = 'Please complete the reCAPTCHA';
			return;
		}
		if (!terms) {
			errorMessage = 'You must agree to the terms';
			return;
		}

		const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
		if (!recaptchaResponse.success) {
			alert('reCAPTCHA verification failed. Please try again.');
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

	const verifyRecaptcha = async (token: string) => {
		const secretKey = '6Lej_-wpAAAAAHR1zJxw4Ksh-JnzpZc75kInsKED';
		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
			{
				method: 'POST'
			}
		);
		return response.json();
	};

	const onRecaptchaLoad = () => {
		grecaptcha.render('recaptcha', {
			sitekey: '6Lej_-wpAAAAAM8JzHOHlC6MatWgHeYajYR8ThPp',
			callback: onRecaptchaSuccess
		});
	};

	const onRecaptchaSuccess = (token: string) => {
		recaptchaToken = token;
	};

	onMount(() => {
		// Ensure reCAPTCHA script is fully loaded
		const interval = setInterval(() => {
			if (typeof grecaptcha !== 'undefined') {
				clearInterval(interval);
				onRecaptchaLoad();
			}
		}, 100);
	});
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
			>I agree that my email address will be used for communicating by system admin. I confirm that
			email adress is correct. I understand that system admin can delete my account if not receiving
			response by email 30 days after notice.</label
		>
		<input type="checkbox" id="terms" required bind:checked={terms} />
	</div>
	<div id="recaptcha"></div>

	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}
	<button type="submit">Register</button>
</form>
