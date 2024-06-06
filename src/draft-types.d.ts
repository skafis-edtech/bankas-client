namespace BasicTypes {
	type UUID = `${string}-${string}-${string}-${string}-${string}`;
	type ISODateString = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
	type ImagePath =
		| `problems/${string}`
		| `answers/${string}`
		| `https:${string}.${'jpeg' | 'gif' | 'png' | 'apng' | 'svg' | 'bmp' | 'ico'}`;
}

namespace Firestore {
	interface Problem {
		skfCode: string;
		problemText?: string;
		problemImagePath?: ImagePath;
		answerText?: string;
		answerImagePath?: ImagePath;
		categoryId: UUID;
		createdOn: ISODateString;
	}

	interface Category {
		name: string;
		description: string;
		author: string;
		createdOn: ISODateString;
	}

	interface ProblemList {
		[id: UUID]: Problem;
	}

	interface CategoryList {
		[id: UUID]: Category;
	}
}

namespace ServicesDtos {
	interface ProblemPost {}

	interface ProblemGetBySkfCode {}
	interface ProblemGetBySkfCodeView {}

	interface ProblemGetAllByCategory {}
	interface ProblemGetAllByCategoryView {}

	interface ProblemPut {}

	interface ProblemDelete {}

	interface CategoryPost {}

	interface CategoryGet {}

	interface CategoryPut {}

	interface CategoryDelete {}

	interface MetaGet {}
}

namespace ComponentProps {
	interface ProblemCreate {
		problemText?: string;
		problemImagePath?: ImagePath;
		answerText?: string;
		answerImagePath?: ImagePath;
		problemImageFile?: File | null;
		answerImageFile?: File | null;
	}

	interface CategoryCreate {
		name: string;
		description: string;
	}

	interface ProblemView {
		skfCode: string;
		problemText?: string;
		problemImagePath?: ImagePath;
		answerText?: string;
		answerImagePath?: ImagePath;

		category: string;
		author: string;
		createdOn: ISODateString;
	}

	interface CategoryView {
		name: string;
		description: string;
		author: string;
		createdOn: ISODateString;
	}
}

export { Firestore, ComponentProps, BasicTypes };
