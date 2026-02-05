import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export const getIdToken = async () => {
	try {
		const session = await fetchAuthSession();
		return session.tokens?.accessToken?.toString() || null;
	} catch (err) {
		console.error("Error fetching ID token:", err);
		return null;
	}
};

const headers = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: headers,
});

const s3axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_PRESIGNED_BASE_URL,
	// headers: headers,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = await getIdToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const token = await getIdToken();
		if (error.response?.status === 401 && !token) {
			window.location.href = "/authentication/signin";
		}
		return Promise.reject(error);
	},
);

export { s3axiosInstance };
export default axiosInstance;
