import type { Handle } from '@sveltejs/kit';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '$services/firebaseConfig';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = getAuth();
	const user = auth.currentUser;

	if (user) {
		const userDoc = await getDoc(doc(db, 'users', user.uid));
		event.locals.user = userDoc.exists() ? (userDoc.data() as App.Locals['user']) : null;
	} else {
		event.locals.user = null;
	}

	// Example: Restrict access based on user role
	if (
		event.locals.user &&
		event.url.pathname.startsWith('/admin') &&
		event.locals.user.role !== 'admin'
	) {
		throw redirect(302, '/');
	}

	// Example: Redirect to login if user is not authenticated
	if (!event.locals.user && event.url.pathname.startsWith('/private')) {
		throw redirect(302, '/login');
	}

	const response = await resolve(event);
	return response;
};

export async function getSession({ locals }: { locals: App.Locals }) {
	return {
		user: locals.user
	};
}
