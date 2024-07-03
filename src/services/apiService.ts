import axios from 'axios';
import { get } from 'svelte/store';
import {
	AuthControllerApi,
	CategoryControllerApi,
	ProblemControllerApi,
	TestControllerApi,
	UserControllerApi
} from './gen-client/api'; // Adjust the import path
import { currentUser } from '$lib/stores';
import { BASE_PATH } from './gen-client/base';

const axiosInstance = axios.create({
	baseURL: BASE_PATH
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = await new Promise((resolve) => {
			const unsubscribe = currentUser.subscribe((user) => {
				if (user && user.idToken) {
					resolve(user.idToken);
				} else {
					resolve(null); // Resolve with null immediately if no user is logged in
				}
				unsubscribe();
			});
		});
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		// Dynamically set the Content-Type header
		if (config.data instanceof FormData) {
			config.headers['Content-Type'] = 'multipart/form-data';
		} else {
			config.headers['Content-Type'] = 'application/json';
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const categoryApi = new CategoryControllerApi(undefined, BASE_PATH, axiosInstance);
const problemApi = new ProblemControllerApi(undefined, BASE_PATH, axiosInstance);
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const testApi = new TestControllerApi(undefined, BASE_PATH, axiosInstance);
const authApi = new AuthControllerApi(undefined, BASE_PATH, axiosInstance);

export { categoryApi, problemApi, userApi, testApi, authApi };
