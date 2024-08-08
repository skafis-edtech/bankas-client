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
		categories: string[];
		sourceId: string;
	}

	interface ProblemMetaData {
		author: string;
		categoryName: string;
		source: string;
	}

	interface ProblemCreateFormData {
		sourceListNr: number;
		problemText: string;
		answerText: string;
		problemImageFile: File | null;
		answerImageFile: File | null;
		tempProblemImageDisplay: string | undefined;
		tempAnswerImageDisplay: string | undefined;
	}

	interface ProblemEditData {
		id: string;
		sourceListNr: number;
		problemText: string;
		answerText: string;
		problemImageSrc: string;
		answerImageSrc: string;
	}
}
