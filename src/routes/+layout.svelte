<script lang="ts">
	import '../app.css';
	import '../reset.css';
	import 'katex/dist/katex.css';
	import 'carta-md/default.css';
	import '../MarkdownInput.css';
	import '@cartamd/plugin-tikz/fonts.css';

	import { writable, type Writable } from 'svelte/store';
	import { onDestroy, setContext } from 'svelte';
	import { loginUser, logout } from '$services/auth';
	import type { AuthContext, User } from '../types';
	import { auth, db } from '$services/firebaseConfig';
	import { doc, getDoc } from 'firebase/firestore';
	import Footer from '$components/layout/Footer.svelte';
	import { setAuthToken, userApi } from '$services/apiService';
	import { goto } from '$app/navigation';
	import GlobalAlert from '$components/layout/GlobalAlert.svelte';
	import { authInitialized } from '$lib/stores';
	import HeaderDesktop from '$components/layout/HeaderDesktop.svelte';
	import HeaderMobile from '$components/layout/HeaderMobile.svelte';
	import { skfList, websiteState } from '$utils/persistentStore';
	import { Alert } from 'flowbite-svelte';

	const userStore: Writable<User | null> = writable(null);

	setContext('skfList', {
		list: skfList,
		setList: (list: string) => skfList.set(list),
		appendItemToList: (item: string) =>
			skfList.update((currentList) => currentList.concat(' ' + item)),
		removeItemFromList: (item: string) =>
			skfList.update((currentList) => currentList.split(item).join('')),
		isInList: (item: string) => $skfList.includes(item)
	});

	$: if ($websiteState === 0) {
		skfList.set('');
		websiteState.set(2);
	} else if ($websiteState === 1) {
		skfList.set('');
		websiteState.set(3);
	}

	const firebaseUnsubscribe = auth.onAuthStateChanged(async (user) => {
		if (user) {
			const idToken = await user.getIdToken();
			setAuthToken(idToken);

			const userRes = await userApi.getMyInfo();
			const userData = userRes.data;

			userStore.set({
				id: user.uid,
				username: userData.username,
				role: userData.role,
				jwt: idToken
			});

			console.log('User email verified:', user.emailVerified);
		} else {
			userStore.set(null);
			setAuthToken(null);
		}
		authInitialized.set(true);
	});

	setContext<AuthContext>('authContext', { user: userStore, login: loginUser, logout });

	onDestroy(() => firebaseUnsubscribe());
</script>

<header class="no-print">
	<div class="block lg:hidden"><HeaderMobile /></div>
	<div class="hidden lg:block"><HeaderDesktop /></div>
</header>
<main>
	<aside class="no-print"></aside>
	<section><slot /></section>
	<aside class="no-print">
		<div class="fixed left-0 bottom-0">
			<button on:click={() => goto('/magic')}><p>.</p></button>
		</div>
	</aside>
</main>
<footer class="no-print">
	<Footer /><GlobalAlert />
	{#if $websiteState === 0}
		<Alert
			class="fixed bottom-2 w-full left-0 text-lg"
			color="blue"
			dismissable
			on:click={() => ($websiteState = 1)}
			border
		>
			Šis tinklapis naudoja Google Analytics slapukus bei Jūsų kompiuterio atmintį. Tęsdami
			lankymąsi puslapyje Jūs sutinkate su slapukų bei kompiuterio atminties naudojimu. Plačiau
			puslapyje{' '}
			<a href="/about#terms">"Apie"</a>.
		</Alert>
	{/if}
</footer>

<style>
	header {
		height: 60px;
	}
	footer {
		height: 68px;
		padding: 10px;
		text-align: center;
	}
	main {
		min-height: calc(100vh - 60px - 68px);
		display: flex;
	}
	section {
		flex: 10 10 0;
		background-color: beige;
		padding: 10px;
		max-width: 100%;
		overflow-x: auto;
	}
	aside {
		flex: 3 3 0;
	}
	@media screen and (max-width: 1300px) {
		aside {
			display: none;
		}
		header {
			height: fit-content;
		}
	}
</style>
