import axios from 'axios';
import {
	CategoryControllerApi,
	CategoryControllerOldApi,
	ProblemControllerApi,
	ProblemControllerOldApi,
	SourceControllerApi,
	TestControllerApi,
	UserControllerApi
} from './gen-client/api';
import { BASE_PATH } from './gen-client/base';

const axiosInstance = axios.create({
	baseURL: BASE_PATH
});

axiosInstance.interceptors.request.use(
	async (config) => {
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

const categoryOldApi = new CategoryControllerOldApi(undefined, BASE_PATH, axiosInstance);
const problemOldApi = new ProblemControllerOldApi(undefined, BASE_PATH, axiosInstance);
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const testApi = new TestControllerApi(undefined, BASE_PATH, axiosInstance);

export { categoryApi, categoryOldApi, problemOldApi, problemApi, sourceApi, userApi, testApi };
