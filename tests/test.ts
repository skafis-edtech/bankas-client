import { registerUser } from '$services/auth';
import { db } from '$services/firebaseConfig';
import { expect, test } from '@playwright/test';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

test('should not allow creating a user with a role admin (clean db if fails)', async ({ page }) => {
	let error = null;
	try {
		await registerUser(getRandomEmail(), getRandomPassword(), getRandomUsername(), 'admin');
	} catch (e) {
		error = e;
	}
	expect(error).not.toBeNull();
});

test("should not allow a user to read users' data", async ({ page }) => {
	let error = null;
	try {
		const docRef = doc(db, 'users');
		const docSnap = await getDoc(docRef);
	} catch (e) {
		error = e;
	}
	expect(error).not.toBeNull();
});

test('should not allow a user to delete users document', async () => {
	let error = null;
	try {
		await deleteDoc(doc(db, 'users'));
	} catch (e) {
		error = e;
	}
	expect(error).not.toBeNull();
});

test('should not allow a user to update users document', async () => {
	let error = null;
	try {
		await updateDoc(doc(db, 'users'), {});
	} catch (e) {
		error = e;
	}
	expect(error).not.toBeNull();
});

//UTILS
const getRandomString = (length: number) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const getRandomEmail = () => {
	return `${getRandomString(10)}@example.com`;
};

export const getRandomUsername = () => {
	return getRandomString(8);
};

export const getRandomPassword = () => {
	return getRandomString(12);
};
