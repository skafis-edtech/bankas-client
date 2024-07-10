<script lang="ts">
	import '../app.css';
	import { writable, type Writable } from 'svelte/store';
	import { onDestroy, setContext } from 'svelte';
	import { loginUser, logout } from '$services/auth';
	import type { AuthContext, User } from '../types';
	import { auth, db } from '$services/firebaseConfig';
	import { doc, getDoc } from 'firebase/firestore';
	import Header from '$components/layout/Header.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import { setAuthToken } from '$services/apiService';
	import { goto } from '$app/navigation';
	import GlobalAlert from '$components/ui/GlobalAlert.svelte';
	import { authInitialized } from '$lib/stores';

	const userStore: Writable<User | null> = writable(null);

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

<header>
	<Header />
	<p class="text-sm text-center my-2">
		Naudodamiesi šiuo tinklapiu jūs sutinkate su Google Analytics slapukų naudojimu.
	</p>
</header>
<main>
	<aside></aside>
	<section><slot /></section>
	<aside>
		<div class="fixed left-0 bottom-0">
			<button on:click={() => goto('/magic')}><p>.</p></button>
		</div>
	</aside>
</main>
<footer><Footer /></footer>
<GlobalAlert />

<style lang="scss">
	header {
		height: 95px;
	}
	footer {
		height: 68px;
		padding: 10px;
		text-align: center;
	}
	main {
		min-height: calc(100vh - 95px - 68px);
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
