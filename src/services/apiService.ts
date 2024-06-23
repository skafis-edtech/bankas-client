import axios from 'axios';
import { CategoryControllerApi, ProblemControllerApi, TestControllerApi } from './gen-client/api'; // Adjust the import path

const basePath = 'https://api.bankas.skafis.lt';
// const accessToken = 'your-access-token'; // Replace with your actual access token

const axiosInstance = axios.create({
	baseURL: basePath
	// headers: {
	// 	Authorization: `Bearer ${accessToken}`
	// }
});

const categoryApi = new CategoryControllerApi(undefined, basePath, axiosInstance);
const problemApi = new ProblemControllerApi(undefined, basePath, axiosInstance);
const testApi = new TestControllerApi(undefined, basePath, axiosInstance);

export { categoryApi, problemApi, testApi };
