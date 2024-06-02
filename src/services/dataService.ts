import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

export interface Problem {
	id: string;
	problemText?: string;
	problemImage?: string;
	answerText?: string;
	answerImage?: string;
	categoryId: string;
	createdOn: string;
}

export interface Category {
	id: string;
	name: string;
	description: string;
	createdBy: string;
	createdOn: string;
}

export interface Data {
	problems: Record<string, Problem>;
	categories: Record<string, Category>;
}

const isUrl = (path: string): boolean => path.startsWith('https');

const getImageUrl = async (path: string): Promise<string> => {
	if (isUrl(path)) {
		return path;
	} else {
		const storageRef = ref(storage, path);
		return await getDownloadURL(storageRef);
	}
};

export const fetchData = async (): Promise<Data> => {
	const problemsSnapshot = await getDocs(collection(db, 'problems'));
	const categoriesSnapshot = await getDocs(collection(db, 'categories'));

	let problems: Record<string, Problem> = {};
	for (const doc of problemsSnapshot.docs) {
		const data = doc.data() as Problem;
		if (data.problemImage && !isUrl(data.problemImage)) {
			data.problemImage = await getImageUrl(data.problemImage);
		}
		if (data.answerImage && !isUrl(data.answerImage)) {
			data.answerImage = await getImageUrl(data.answerImage);
		}
		problems[doc.id] = data;
	}

	let categories: Record<string, Category> = {};
	for (const doc of categoriesSnapshot.docs) {
		categories[doc.id] = doc.data() as Category;
	}

	return { problems, categories };
};

export interface ProblemWithMeta {
	id: string;
	problemText?: string;
	problemImage?: string;
	answerText?: string;
	answerImage?: string;
	category: string;
	createdOn: string;
	author: string;
}

export const fetchByIdAllData = async (id: string): Promise<ProblemWithMeta | null> => {
	try {
		const problemDocRef = doc(db, 'problems', id);
		const problemDocSnap = await getDoc(problemDocRef);

		if (problemDocSnap.exists()) {
			const problemData = problemDocSnap.data();
			const problem: ProblemWithMeta = {
				id: id,
				problemText: problemData.problemText || '',
				problemImage: problemData.problemImage ? await getImageUrl(problemData.problemImage) : '',
				answerText: problemData.answerText || '',
				answerImage: problemData.answerImage ? await getImageUrl(problemData.answerImage) : '',
				category: '',
				createdOn: problemData.createdOn,
				author: problemData.createdBy || ''
			};

			// Fetch the corresponding category
			const categoryDocRef = doc(db, 'categories', problemData.categoryId);
			const categoryDocSnap = await getDoc(categoryDocRef);

			if (categoryDocSnap.exists()) {
				problem.category = categoryDocSnap.data().name;
			}

			return problem;
		} else {
			alert('Problem with the given ID does not exist.');
			return null;
		}
	} catch (error) {
		console.error('Error fetching document:', error);
		return null;
	}
};

export const fetchCategories = async (): Promise<Category[]> => {
	const categoriesSnapshot = await getDocs(collection(db, 'categories'));

	let categories: Category[] = [];
	for (const doc of categoriesSnapshot.docs) {
		categories.push({ ...doc.data(), id: doc.id } as Category);
	}

	return categories;
};

export const fetchProblemsOfCategory = async (categoryId: string): Promise<Problem[]> => {
	const problemsSnapshot = await getDocs(collection(db, 'problems'));

	let problems: Problem[] = [];
	for (const doc of problemsSnapshot.docs) {
		const data = doc.data() as Problem;
		if (data.categoryId === categoryId) {
			const problem: Problem = {
				id: doc.id,
				problemText: data.problemText || '',
				problemImage: data.problemImage ? await getImageUrl(data.problemImage) : '',
				answerText: data.answerText || '',
				answerImage: data.answerImage ? await getImageUrl(data.answerImage) : '',
				createdOn: data.createdOn,
				categoryId: data.categoryId
			};
			problems.push(problem);
		}
	}

	return problems;
};
