// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace Components {
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
	}
}

export {};
