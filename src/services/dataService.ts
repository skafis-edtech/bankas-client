import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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

export const isUrl = (path: string): boolean => path.startsWith('https');

export const getImageUrl = async (path: string): Promise<string> => {
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
	problems: ProblemFullWithFiles[]
): Promise<void> => {
	setDoc(doc(db, 'categories', category.id), {
		name: category.name,
		description: category.description || '',
		createdBy: category.createdBy,
		createdOn: category.createdOn
	});

	problems.forEach(async (problem) => {
		setDoc(doc(db, 'problems', problem.id), {
			problemText: problem.problemText || '',
			problemImage: problem.problemImage || '',
			answerText: problem.answerText || '',
			answerImage: problem.answerImage || '',
			categoryId: category.id,
			createdOn: problem.createdOn
		});
		try {
			if (problem.problemImageFile && problem.problemImage && !isUrl(problem.problemImage)) {
				const storageRefProblem = ref(storage, problem.problemImage);
				await uploadBytes(storageRefProblem, problem.problemImageFile);
			}
			if (problem.answerImageFile && problem.answerImage && !isUrl(problem.answerImage)) {
				const storageRefAnswer = ref(storage, problem.answerImage);
				await uploadBytes(storageRefAnswer, problem.answerImageFile);
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	});
};

/**
 * Updates the last used SKF code in Firestore.
 * @param {string} lastUsedCode - The last used SKF code to be updated.
 * @returns {Promise<void>}
 */
export const updateLastUsedSkfCode = async (lastUsedCode: string): Promise<void> => {
	try {
		const docRef = doc(db, 'meta', 'problemMeta');
		await setDoc(docRef, { lastUsedCode: lastUsedCode }, { merge: true }); // Add merge option to update instead of overwrite
		console.log('Document successfully updated');
	} catch (error) {
		console.error('Error updating document: ', error);
	}
};
