interface Route {
	path: string;
	name: string;
}

export const routes: Route[] = [
	{ path: '/', name: 'Home' },
	{ path: '/private/submit-dashboard', name: 'submit dashboard' },
	{ path: '/admin/review-dashboard', name: 'review dashboard' },
	{ path: '/private/submit-new', name: 'submit new' },
	{ path: '/register', name: 'register' }
];
