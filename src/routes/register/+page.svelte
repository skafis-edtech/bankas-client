<script lang="ts">
	import { isUsernameAvailable, registerUser } from '$services/auth';
	import { goto } from '$app/navigation';
	import { ROLES } from '$utils/constants';
	import { Alert, Button, Checkbox, Helper, Input, Label } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { AuthContext } from '../../types';
	import { page } from '$app/stores';

	const { user } = getContext('authContext') as AuthContext;

	const redirectUrl: string | null = $page.url.searchParams.get('redirect');

	onMount(() => {
		if ($user) {
			if ($user.role === ROLES.ADMIN) {
				goto('/review-dashboard');
			} else if ($user.role === ROLES.USER) {
				goto('/submit/dashboard');
			} else if ($user.role === ROLES.SUPER_ADMIN) {
				goto('/review-dashboard');
			} else {
				throw new Error('Unknown role' + $user.role);
			}
		}
	});

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let role = ROLES.USER;
	let errorMessage = '';
	let terms = false;

	async function register() {
		if (/\s/.test(username)) {
			errorMessage = 'Prisijungimo vardas negali turėti tarpų ("whitespace" simbolių)';
			return;
		}
		if (username.includes('@')) {
			errorMessage = 'Prisijungimo vardas negali turėti simbolio @';
			return;
		}
		if (username.length < 3) {
			errorMessage = 'Prisijungimo vardas turi būti bent 3 simbolių ilgio';
			return;
		}
		if (email.includes('?') || /\s/.test(email)) {
			errorMessage = 'El. paštas negali turėti simbolio ? arba tarpų ("whitespace")';
			return;
		}
		if (password !== confirmPassword) {
			errorMessage = 'Slaptažodžiai nesutampa';
			return;
		}
		if (!terms) {
			errorMessage = 'Turite sutikti su sąlygomis';
			return;
		}
		if (!email || !password || !username) {
			errorMessage = 'Visi laukai turi būti užpildyti';
			return;
		}
		const isAvailable = await isUsernameAvailable(username);
		if (!isAvailable) {
			errorMessage = 'Prisijungimo vardas jau užimtas';
			return;
		}
		try {
			await registerUser(email, password, username, role);
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				goto('/');
			}
		} catch (error: any) {
			console.error('Registration failed:', error);
			errorMessage = error.message;
		}
	}
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
	<h2 class="text-center text-2xl font-semibold text-gray-700 dark:text-white">Registracija</h2>
	<p class="text-red-600">
		Jei jau turite testai.skafis.lt paskyrą, nesiregistruokite, o susisiekite info@skafis.lt
	</p>
	<form on:submit|preventDefault={register} class="space-y-6">
		<div>
			<Label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>El. paštas (nebus matomas kitiems, naudojamas susisiekimui bei slaptažodžio atkūrimui)</Label
			>
			<Input
				id="email"
				type="email"
				bind:value={email}
				placeholder="example@example.com"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Prisijungimo vardas (bus matomas visiems)</Label
			>
			<Input
				id="username"
				type="text"
				bind:value={username}
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
				bind:value={password}
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
				bind:value={confirmPassword}
				placeholder="********"
				required
				class="mt-1 block w-full px-4 py-2 text-lg"
			/>
		</div>
		<div>
			<Label for="terms" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Perskaičiau ir sutinku su <a
					href="/about#terms"
					class="text-blue-600 hover:underline dark:text-blue-400"
				>
					bankas.skafis.lt</a
				>
				bei
				<a
					href="https://testai.skafis.lt/terms"
					class="text-blue-600 hover:underline dark:text-blue-400"
				>
					testai.skafis.lt</a
				> platformų sąlygomis (galite teikti pasiūlymus pakeitimui el. paštu info@skafis.lt). Patvirtinu,
				kad el. pašto adresas yra teisingas.
			</Label>
			<Checkbox id="terms" required bind:checked={terms} class="mt-1 w-6 h-6 block" />
		</div>

		{#if errorMessage}
			<p class="text-red-600">{errorMessage}</p>
		{/if}
		<Button type="submit" class="w-full py-2 text-lg">Registruotis</Button>
	</form>
	<Helper class="mt-4 text-center">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Jau turite paskyrą? <a href="/login" class="text-blue-600 hover:underline dark:text-blue-400">
				Prisijunkite
			</a>
		</p>
	</Helper>
</div>
