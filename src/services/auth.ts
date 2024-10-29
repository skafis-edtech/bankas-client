import { auth, db } from '$services/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { query, where, collection, getDocs } from 'firebase/firestore';

export const isUsernameAvailable = async (username: string) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('username', '==', username));
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.length === 0;
};

export const loginUser = async (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
	await signOut(auth);
};
