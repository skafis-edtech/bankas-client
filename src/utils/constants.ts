interface Route {
	path: string;
	name: string;
}

export const ROUTES: Route[] = [
	{ path: '/', name: 'Home' },
	{ path: '/submit-dashboard', name: 'submit dashboard' },
	{ path: '/review-dashboard', name: 'review dashboard' },
	{ path: '/submit-new', name: 'submit new' },
	{ path: '/register', name: 'register' }
];

interface Roles {
	[key: string]: string;
}

export const ROLES: Roles = {
	ADMIN: 'admin',
	USER: 'user'
};
