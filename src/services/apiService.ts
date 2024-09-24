import axios from 'axios';
import {
	CategoryControllerApi,
	ContentControllerApi,
	MiscControllerApi,
	ReviewControllerApi,
	UserControllerApi,
	ViewControllerApi
} from './gen-client/api';
import { BASE_PATH } from './gen-client/base';
import { errorStore, loadingStore } from '$lib/stores';

const axiosInstance = axios.create({
	baseURL: BASE_PATH
});

axiosInstance.interceptors.request.use(
	async (config) => {
		loadingStore.set(true);
		return config;
	},
	(error) => {
		loadingStore.set(false);
		errorStore.set(error.message || 'An unknown error occurred');
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		loadingStore.set(false);
		return response;
	},
	(error) => {
		loadingStore.set(false);
		errorStore.set(error.response?.data?.message || error.message || 'An unknown error occurred');
		console.error('Response error:', error);
		return Promise.reject(error);
	}
);

export const setAuthToken = (token: string | null) => {
	if (token) {
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete axiosInstance.defaults.headers.common['Authorization'];
	}
};

const categoryApi = new CategoryControllerApi(undefined, BASE_PATH, axiosInstance);
const contentApi = new ContentControllerApi(undefined, BASE_PATH, axiosInstance);
const miscApi = new MiscControllerApi(undefined, BASE_PATH, axiosInstance);
const reviewApi = new ReviewControllerApi(undefined, BASE_PATH, axiosInstance);
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const viewApi = new ViewControllerApi(undefined, BASE_PATH, axiosInstance);

export { categoryApi, contentApi, miscApi, reviewApi, userApi, viewApi };
