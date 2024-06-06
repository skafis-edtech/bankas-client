import { describe, expect, it, beforeEach, vi, type Mock } from 'vitest';
import { doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage } from '$services/firebaseConfig';
import {
	getImageUrl,
	fetchData,
	fetchByIdAllData,
	fetchProblemsOfCategory,
	fetchNumOfProblems,
	fetchNumOfCategories,
	fetchLastUsedCode,
	postCategoryWithProblemsFull,
	updateLastUsedSkfCode,
	type ProblemFullWithFiles
} from '$services/dataService';
import { isUrl } from '$utils/helpers';

// Mock Firebase functions
vi.mock('firebase/firestore', () => ({
	collection: vi.fn(),
	doc: vi.fn(),
	getDoc: vi.fn(),
	getDocs: vi.fn(),
	setDoc: vi.fn()
}));

vi.mock('firebase/storage', () => ({
	ref: vi.fn(),
	getDownloadURL: vi.fn(),
	uploadBytes: vi.fn()
}));

vi.mock('$services/firebaseConfig', () => ({
	db: {},
	storage: {}
}));

vi.mock('$utils/helpers', () => ({
	isUrl: vi.fn()
}));

describe('Firebase Functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getImageUrl', () => {
		it('should return the URL if the path is a URL', async () => {
			(isUrl as Mock).mockReturnValue(true);
			const url = await getImageUrl('https://example.com/image.jpg');
			expect(url).toBe('https://example.com/image.jpg');
		});

		it('should fetch the URL from Firebase storage if the path is not a URL', async () => {
			(isUrl as Mock).mockReturnValue(false);
			(getDownloadURL as Mock).mockResolvedValue('https://firebase.com/image.jpg');
			const url = await getImageUrl('path/to/image.jpg');
			expect(ref).toHaveBeenCalledWith(storage, 'path/to/image.jpg');
			expect(url).toBe('https://firebase.com/image.jpg');
		});
	});

	describe('fetchData', () => {
		it('should fetch problems and categories', async () => {
			const mockProblemsSnapshot = {
				docs: [
					{
						id: '1',
						data: () => ({
							problemText: 'Problem 1',
							categoryId: 'cat1',
							createdOn: '2023-01-01'
						})
					},
					{
						id: '2',
						data: () => ({
							problemText: 'Problem 2',
							categoryId: 'cat2',
							createdOn: '2023-01-02'
						})
					}
				]
			};
			const mockCategoriesSnapshot = {
				docs: [
					{
						id: 'cat1',
						data: () => ({
							name: 'Category 1',
							createdBy: 'user1',
							createdOn: '2023-01-01'
						})
					},
					{
						id: 'cat2',
						data: () => ({
							name: 'Category 2',
							createdBy: 'user2',
							createdOn: '2023-01-02'
						})
					}
				]
			};
			(getDocs as Mock).mockResolvedValueOnce(mockProblemsSnapshot);
			(getDocs as Mock).mockResolvedValueOnce(mockCategoriesSnapshot);

			const data = await fetchData();
			expect(Object.keys(data.problems).length).toBe(2);
			expect(Object.keys(data.categories).length).toBe(2);
		});
	});

	describe('fetchByIdAllData', () => {
		it('should fetch problem by ID along with its metadata', async () => {
			const mockProblemDocSnap = {
				exists: () => true,
				data: () => ({
					problemText: 'Problem 1',
					problemImage: 'path/to/image.jpg',
					answerText: 'Answer 1',
					answerImage: 'path/to/answer.jpg',
					categoryId: 'cat1',
					createdOn: '2023-01-01',
					createdBy: 'user1'
				})
			};
			const mockCategoryDocSnap = {
				exists: () => true,
				data: () => ({
					name: 'Category 1',
					createdBy: 'user1',
					createdOn: '2023-01-01'
				})
			};
			(getDoc as Mock).mockResolvedValueOnce(mockProblemDocSnap);
			(getDoc as Mock).mockResolvedValueOnce(mockCategoryDocSnap);
			(getDownloadURL as Mock).mockResolvedValueOnce('https://firebase.com/image.jpg');
			(getDownloadURL as Mock).mockResolvedValueOnce('https://firebase.com/answer.jpg');

			const problem = await fetchByIdAllData('1');
			expect(problem).toEqual({
				id: '1',
				problemText: 'Problem 1',
				problemImage: 'https://firebase.com/image.jpg',
				answerText: 'Answer 1',
				answerImage: 'https://firebase.com/answer.jpg',
				category: 'Category 1',
				createdOn: '2023-01-01',
				author: 'user1'
			});
		});

		it('should return null if problem does not exist', async () => {
			const mockProblemDocSnap = {
				exists: () => false
			};
			(getDoc as Mock).mockResolvedValueOnce(mockProblemDocSnap);

			const problem = await fetchByIdAllData('1');
			expect(problem).toBeNull();
		});
	});

	describe('fetchProblemsOfCategory', () => {
		it('should fetch problems of a specific category', async () => {
			const mockProblemsSnapshot = {
				docs: [
					{
						id: '1',
						data: () => ({
							problemText: 'Problem 1',
							problemImage: 'path/to/image.jpg',
							answerText: 'Answer 1',
							answerImage: 'path/to/answer.jpg',
							categoryId: 'cat1',
							createdOn: '2023-01-01'
						})
					},
					{
						id: '2',
						data: () => ({
							problemText: 'Problem 2',
							problemImage: 'path/to/image.jpg',
							answerText: 'Answer 2',
							answerImage: 'path/to/answer.jpg',
							categoryId: 'cat2',
							createdOn: '2023-01-02'
						})
					}
				]
			};
			(getDocs as Mock).mockResolvedValueOnce(mockProblemsSnapshot);
			(getDownloadURL as Mock).mockResolvedValue('https://firebase.com/image.jpg');

			const problems = await fetchProblemsOfCategory('cat1');
			expect(problems.length).toBe(1);
			expect(problems[0].categoryId).toBe('cat1');
		});
	});

	describe('fetchNumOfProblems', () => {
		it('should fetch the number of problems', async () => {
			const mockProblemsSnapshot = {
				size: 2
			};
			(getDocs as Mock).mockResolvedValueOnce(mockProblemsSnapshot);

			const numProblems = await fetchNumOfProblems();
			expect(numProblems).toBe(2);
		});
	});

	describe('fetchNumOfCategories', () => {
		it('should fetch the number of categories', async () => {
			const mockCategoriesSnapshot = {
				size: 2
			};
			(getDocs as Mock).mockResolvedValueOnce(mockCategoriesSnapshot);

			const numCategories = await fetchNumOfCategories();
			expect(numCategories).toBe(2);
		});
	});

	describe('fetchLastUsedCode', () => {
		it('should fetch the last used code', async () => {
			const mockDocSnap = {
				exists: () => true,
				data: () => ({
					lastUsedCode: 'ABC123'
				})
			};
			(getDoc as Mock).mockResolvedValueOnce(mockDocSnap);

			const lastUsedCode = await fetchLastUsedCode();
			expect(lastUsedCode).toBe('ABC123');
		});

		it('should return undefined if no such document exists', async () => {
			const mockDocSnap = {
				exists: () => false
			};
			(getDoc as Mock).mockResolvedValueOnce(mockDocSnap);

			const lastUsedCode = await fetchLastUsedCode();
			expect(lastUsedCode).toBeUndefined();
		});
	});

	describe('postCategoryWithProblemsFull', () => {
		it('should post category and its problems to the database', async () => {
			const category = {
				id: 'cat1',
				name: 'Category 1',
				description: 'Description 1',
				createdBy: 'user1',
				createdOn: '2023-01-01'
			};
			const problems: ProblemFullWithFiles[] = [
				{
					id: '1',
					problemText: 'Problem 1',
					problemImage: 'path/to/image.jpg',
					answerText: 'Answer 1',
					answerImage: 'path/to/answer.jpg',
					problemImageFile: new Blob() as File,
					answerImageFile: new Blob() as File,
					categoryId: 'cat1',
					createdOn: '2023-01-01'
				}
			];
			(isUrl as Mock).mockReturnValue(false);
			(uploadBytes as Mock).mockResolvedValue({});

			await postCategoryWithProblemsFull(category, problems);
			expect(setDoc).toHaveBeenCalledTimes(2);
			expect(uploadBytes).toHaveBeenCalledTimes(2);
		});
	});

	describe('updateLastUsedSkfCode', () => {
		it('should update the last used SKF code in Firestore', async () => {
			await updateLastUsedSkfCode('NEWCODE123');
			expect(setDoc).toHaveBeenCalledWith(
				doc(db, 'meta', 'problemMeta'),
				{ lastUsedCode: 'NEWCODE123' },
				{ merge: true }
			);
		});
	});
});
