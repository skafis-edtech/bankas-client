import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

export interface Problem {
	problemText?: string;
	problemImage?: string;
	answerText?: string;
	answerImage?: string;
	categoryId: string;
	createdOn: string;
}

export interface Category {
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
