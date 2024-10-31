import { auth } from '$services/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const loginUser = async (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
	await signOut(auth);
};
