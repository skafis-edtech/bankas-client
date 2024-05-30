import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '$services/firebaseConfig';

interface User {
	uid: string;
	email: string | null;
	username: string;
	role: string;
}

const currentUser: Writable<User | null> = writable(null);

onAuthStateChanged(auth, async (firebaseUser) => {
	if (firebaseUser) {
		const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
		if (userDoc.exists()) {
			const userData = userDoc.data() as User;
			currentUser.set({
				uid: firebaseUser.uid,
				email: firebaseUser.email,
				username: userData.username,
				role: userData.role
			});
		}
	} else {
		currentUser.set(null);
	}
});

const logout = async () => {
	await signOut(auth);
	currentUser.set(null);
};

export { currentUser, logout };
