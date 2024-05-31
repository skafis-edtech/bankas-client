import { currentUser, type User } from '$lib/stores';
import { auth, db } from '$services/firebaseConfig';
import { ROLES } from '$utils/constants';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';
import { doc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';

export const registerUser = async (
	email: string,
	password: string,
	username: string,
	role: string
) => {
	if (role !== ROLES.USER) {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;

		await setDoc(doc(db, 'users', user.uid), {
			username,
			role,
			email: user.email
		});
		return user;
	} else {
		throw new Error('Invalid role');
	}
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
	currentUser.set(null);
};

export const verifyRecaptcha = async (token: string) => {
	const secretKey = '6Lej_-wpAAAAAHR1zJxw4Ksh-JnzpZc75kInsKED';
	const response = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
		{
			method: 'POST'
		}
	);
	return response.json();
};

export const renderRecaptha = (onRecaptchaSuccess: (token: string) => void) => {
	grecaptcha.render('recaptcha', {
		sitekey: '6Lej_-wpAAAAAM8JzHOHlC6MatWgHeYajYR8ThPp',
		callback: onRecaptchaSuccess
	});
};

export const recaptchaLoaded = (): boolean => {
	return typeof grecaptcha !== 'undefined';
};
