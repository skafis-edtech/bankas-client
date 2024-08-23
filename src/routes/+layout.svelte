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
	import { setAuthToken } from '$services/apiService';
	import { goto } from '$app/navigation';
	import GlobalAlert from '$components/ui/GlobalAlert.svelte';
	import { authInitialized } from '$lib/stores';
	import HeaderDesktop from '$components/layout/HeaderDesktop.svelte';
	import HeaderMobile from '$components/layout/HeaderMobile.svelte';
	import { skfList, cookiesAccepted } from '$utils/persistentStore';
	import { Alert } from 'flowbite-svelte';

	const userStore: Writable<User | null> = writable(null);

	setContext('skfList', {
		list: skfList,
		setList: (list: string[]) => skfList.set(list),
		appendItemToList: (item: string) => skfList.update((currentList) => [...currentList, item]),
		removeItemFromList: (item: string) =>
			skfList.update((currentList) => currentList.filter((i) => i !== item)),
		isInList: (item: string) => $skfList.includes(item)
	});

	const firebaseUnsubscribe = auth.onAuthStateChanged(async (user) => {
		if (user) {
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			const idToken = await user.getIdToken();

			if (userDoc.exists()) {
				const userData = userDoc.data() as User;
				userStore.set({
					id: user.uid,
					username: userData.username,
					role: userData.role
				});
				setAuthToken(idToken);
			} else {
				throw new Error('User not found in database');
			}
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
	<div class="block md:hidden"><HeaderMobile /></div>
	<div class="hidden md:block"><HeaderDesktop /></div>
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
	{#if !$cookiesAccepted}
		<Alert
			class="fixed bottom-2 w-full left-0 text-lg"
			color="blue"
			dismissable
			on:click={() => ($cookiesAccepted = true)}
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
	}
	aside {
		flex: 3 3 0;
	}
	@media screen and (max-width: 768px) {
		aside {
			display: none;
		}
		header {
			height: fit-content;
		}
	}
</style>
