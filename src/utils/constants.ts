interface Route {
	path: string;
	name: string;
}

export const ROUTES: Route[] = [];

interface Roles {
	[key: string]: string;
}

export const ROLES: Roles = {
	ADMIN: 'ADMIN',
	USER: 'USER'
};
