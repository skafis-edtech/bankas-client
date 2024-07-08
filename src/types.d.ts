import type { loginUser, logout } from '$services/auth';

export interface User {
	id: string;
	username: string;
	role: string;
}

export interface AuthContext {
	user: Writable<User | null>;
	login: typeof loginUser;
	logout: typeof logout;
}

export namespace Components {
	interface ProblemMainData {
		skfCode: string;
		problemText: string;
		problemImageSrc: string;
		answerText: string;
		answerImageSrc: string;
	}

	interface ProblemMetaData {
		author: string;
		categoryName: string;
		source: string;
	}

	interface SourceCreateFormData {
		name: string;
		description: string;
	}

	interface ProblemCreateFormData {
		problemText: string;
		answerText: string;
		problemImageFile: File | null;
		answerImageFile: File | null;
		problemImageUrl: string;
		answerImageUrl: string;
	}
}
