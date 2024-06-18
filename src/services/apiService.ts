// apiService.ts
import axios from 'axios';
import { CategoryControllerApi, ProblemControllerApi, TestControllerApi } from './gen-client/api'; // Adjust the import path

const basePath = 'https://api.skafis.bankas.lt'; // Replace with your actual API base URL
const accessToken = 'eykjnkjnkjnkjnkjnkjnkjnkjnkjnkjnkjnkjn'; // Replace with your actual login token
const axiosInstance = axios.create({
	baseURL: basePath,
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});

const categoryApi = new CategoryControllerApi(undefined, basePath, axiosInstance);
const problemApi = new ProblemControllerApi(undefined, basePath, axiosInstance);
const testApi = new TestControllerApi(undefined, basePath, axiosInstance);

export { categoryApi, problemApi, testApi };
