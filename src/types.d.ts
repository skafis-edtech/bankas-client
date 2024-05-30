declare namespace App {
	interface Locals {
		user: {
			uid: string;
			email: string | null;
			username: string;
			role: string;
		} | null;
	}

	interface Session {
		user: {
			uid: string;
			email: string | null;
			username: string;
			role: string;
		} | null;
	}
}
