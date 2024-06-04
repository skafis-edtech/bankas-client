import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import type { Writable } from 'svelte/store';

export interface ProblemForDatabase {
	id: string;
	problemText?: string;
	problemImage?: string;
	answerText?: string;
	answerImage?: string;
	categoryId: string;
	createdOn: string;
}

export interface ProblemFullWithFiles extends ProblemForDatabase {
	problemImageFile?: File | null;
	answerImageFile?: File | null;
}

export interface CategoryForDatabase {
	id: string;
	name: string;
	description: string;
	createdBy: string;
	createdOn: string;
}

export interface Data {
	problems: Record<string, ProblemForDatabase>;
	categories: Record<string, CategoryForDatabase>;
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

	let problems: Record<string, ProblemForDatabase> = {};
	for (const doc of problemsSnapshot.docs) {
		const data = doc.data() as ProblemForDatabase;
		if (data.problemImage && !isUrl(data.problemImage)) {
			data.problemImage = await getImageUrl(data.problemImage);
		}
		if (data.answerImage && !isUrl(data.answerImage)) {
			data.answerImage = await getImageUrl(data.answerImage);
		}
		problems[doc.id] = data;
	}

	let categories: Record<string, CategoryForDatabase> = {};
	for (const doc of categoriesSnapshot.docs) {
		categories[doc.id] = doc.data() as CategoryForDatabase;
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

export const fetchCategories = async (): Promise<CategoryForDatabase[]> => {
	const categoriesSnapshot = await getDocs(collection(db, 'categories'));

	let categories: CategoryForDatabase[] = [];
	for (const doc of categoriesSnapshot.docs) {
		categories.push({ ...doc.data(), id: doc.id } as CategoryForDatabase);
	}

	return categories;
};

export const fetchProblemsOfCategory = async (
	categoryId: string
): Promise<ProblemForDatabase[]> => {
	const problemsSnapshot = await getDocs(collection(db, 'problems'));

	let problems: ProblemForDatabase[] = [];
	for (const doc of problemsSnapshot.docs) {
		const data = doc.data() as ProblemForDatabase;
		if (data.categoryId === categoryId) {
			const problem: ProblemForDatabase = {
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

export const fetchNumOfProblems = async (): Promise<number> => {
	const problemsSnapshot = await getDocs(collection(db, 'problems'));
	return problemsSnapshot.size;
};

export const fetchNumOfCategories = async (): Promise<number> => {
	const categoriesSnapshot = await getDocs(collection(db, 'categories'));
	return categoriesSnapshot.size;
};

export const fetchLastUsedCode = async (): Promise<string | undefined> => {
	try {
		const docRef = doc(db, 'meta', 'problemMeta');
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data();
			return data.lastUsedCode;
		} else {
			console.log('No such document!');
			return undefined;
		}
	} catch (error) {
		console.error('Error fetching document: ', error);
		return undefined;
	}
};

export const postCategoryWithProblemsFull = async (
	category: CategoryForDatabase,
	problems: Writable<ProblemFullWithFiles>[]
): Promise<void> => {
	const categoryRef = collection(db, 'categories');
	const problemsRef = collection(db, 'problems');
	console.log('category', category);
	problems.forEach(async (problem) => {
		console.log('problem', problem);
	});

	alert('TODO: gonna do stuff');
};
