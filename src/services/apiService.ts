import axios from 'axios';
import {
	ApprovalControllerApi,
	CategoryControllerApi,
	CategoryControllerOldApi,
	ProblemControllerApi,
	ProblemControllerOldApi,
	SourceControllerApi,
	TestControllerApi,
	UserControllerApi
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
const problemApi = new ProblemControllerApi(undefined, BASE_PATH, axiosInstance);
const sourceApi = new SourceControllerApi(undefined, BASE_PATH, axiosInstance);
const approvalApi = new ApprovalControllerApi(undefined, BASE_PATH, axiosInstance);

const categoryOldApi = new CategoryControllerOldApi(undefined, BASE_PATH, axiosInstance);
const problemOldApi = new ProblemControllerOldApi(undefined, BASE_PATH, axiosInstance);
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const testApi = new TestControllerApi(undefined, BASE_PATH, axiosInstance);

export {
	categoryApi,
	categoryOldApi,
	problemOldApi,
	problemApi,
	sourceApi,
	userApi,
	testApi,
	approvalApi
};
