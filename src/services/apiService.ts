import axios from 'axios';
import { get } from 'svelte/store';
import {
	CategoryControllerApi,
	ProblemControllerApi,
	TestControllerApi,
	UserControllerApi
} from './gen-client/api'; // Adjust the import path
import { currentUser } from '$lib/stores';

const basePath = 'http://localhost'; //api.bankas.skafis.lt';

const axiosInstance = axios.create({
	baseURL: basePath
});

// Add a request interceptor to set the Authorization header dynamically
axiosInstance.interceptors.request.use(
	async (config) => {
		// Wait for the token to be available
		const token = await new Promise((resolve) => {
			const unsubscribe = currentUser.subscribe((user) => {
				if (user && user.idToken) {
					resolve(user.idToken);
					unsubscribe();
				}
			});
		});
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const categoryApi = new CategoryControllerApi(undefined, basePath, axiosInstance);
const problemApi = new ProblemControllerApi(undefined, basePath, axiosInstance);
const userApi = new UserControllerApi(undefined, basePath, axiosInstance);
const testApi = new TestControllerApi(undefined, basePath, axiosInstance);

export { categoryApi, problemApi, userApi, testApi };
