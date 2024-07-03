<script lang="ts">
	import {
		isUsernameAvailable,
		recaptchaLoaded,
		registerUser,
		renderRecaptha,
		verifyRecaptcha
	} from '$services/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ROLES } from '$utils/constants';
	import { Button, Checkbox, Helper, Input, Label } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let email = writable('');
	let password = writable('');
	let confirmPassword = writable('');
	let username = writable('');
	let role = ROLES.USER;
	let errorMessage = writable('');
	let terms = writable(false);
	// let recaptchaVerified = writable(false);
	// let recaptchaToken = writable('');

	async function register() {
		if ($password !== $confirmPassword) {
			$errorMessage = 'Slaptažodžiai nesutampa';
			return;
		}
		// if (!$recaptchaVerified) {
		// 	$errorMessage = 'Prašome užpildyti reCAPTCHA';
		// 	return;
		// }
		if (!$terms) {
			$errorMessage = 'Turite sutikti su sąlygomis';
			return;
		}
		if (!$email || !$password || !$username) {
			$errorMessage = 'Visi laukai turi būti užpildyti';
			return;
		}
		const isAvailable = await isUsernameAvailable($username);
		if (!isAvailable) {
			$errorMessage = 'Prisijungimo vardas jau užimtas';
			return;
		}

		// const recaptchaResponse = await verifyRecaptcha($recaptchaToken);
		// if (!recaptchaResponse.success) {
		// 	alert('reCAPTCHA patvirtinimas nesėkmingas. Bandykite dar kartą.');
		// 	return;
		// }
		try {
			await registerUser($email, $password, $username, role);
			goto('/');
		} catch (error: any) {
			console.error('Registration failed:', error);
			$errorMessage = error.message;
		}
	}

	// const onRecaptchaLoad = () => {
	// 	renderRecaptha(onRecaptchaSuccess);
	// };

	// const onRecaptchaSuccess = (token: string) => {
	// 	recaptchaToken.set(token);
	// 	recaptchaVerified.set(true);
	// };

	// onMount(() => {
	// 	const interval = setInterval(() => {
	// 		if (recaptchaLoaded()) {
	// 			clearInterval(interval);
	// 			onRecaptchaLoad();
	// 		}
	// 	}, 100);
	// });
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">Registracija</h2>
	<form on:submit|preventDefault={register} class="space-y-6">
		<div>
			<Label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>El. paštas</Label
			>
			<Input
				id="email"
				type="email"
				bind:value={$email}
				placeholder="example@example.com"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Prisijungimo vardas</Label
			>
			<Input
				id="username"
				type="text"
				bind:value={$username}
				placeholder="example123"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Slaptažodis</Label
			>
			<Input
				id="password"
				type="password"
				bind:value={$password}
				placeholder="********"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label
				for="confirmPassword"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Pakartokite slaptažodį</Label
			>
			<Input
				id="confirmPassword"
				type="password"
				bind:value={$confirmPassword}
				placeholder="********"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="terms" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Sutinku, kad mano el. paštas bus naudojamas sistemos administratoriui su manimi susisiekti.
				Patvirtinu, kad el. pašto adresas yra teisingas.
			</Label>
			<Checkbox id="terms" required bind:checked={$terms} class="mt-1 w-6 h-6 block" />
		</div>
		<!-- <div id="recaptcha" class="my-4"></div> -->

		{#if $errorMessage}
			<p class="text-red-600">{$errorMessage}</p>
		{/if}
		<Button type="submit" class="w-full py-2 text-lg">Registruotis</Button>
	</form>
	<Helper class="mt-4 text-center">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Jau turite paskyrą? <a href="/login" class="text-blue-600 hover:underline dark:text-blue-400">
				Prisijungti
			</a>
		</p>
	</Helper>
</div>
