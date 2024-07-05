import axios from 'axios';
import {
	AuthControllerApi,
	CategoryControllerApi,
	ProblemControllerApi,
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
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const testApi = new TestControllerApi(undefined, BASE_PATH, axiosInstance);
const authApi = new AuthControllerApi(undefined, BASE_PATH, axiosInstance);

export { categoryApi, problemApi, userApi, testApi, authApi };
