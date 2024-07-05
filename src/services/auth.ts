import { auth, db } from '$services/firebaseConfig';
import { ROLES } from '$utils/constants';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';

export const registerUser = async (
	email: string,
	password: string,
	username: string,
	role: string
) => {
	if (role === ROLES.USER) {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		await setDoc(doc(db, 'users', user.uid), {
			id: user.uid,
			bio: '',
			username,
			role,
			email: user.email
		});
		return user;
	} else {
		throw new Error('Invalid role');
	}
};

export const isUsernameAvailable = async (username: string) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('username', '==', username));
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.length === 0;
};

export const loginUser = async (username: string, password: string) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('username', '==', username));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		throw new Error('User does not exist');
	}
	const userDoc = querySnapshot.docs[0];
	const email = userDoc.data().email;
	return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
	await signOut(auth);
};
