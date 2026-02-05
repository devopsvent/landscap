import {
	CancelSubscriptionPayload,
	CreateSessionPayload,
	CreateSessionResponse,
	FetchPlansResponse,
	UpdateSessionPayload,
} from "@/types/Subscription";
import axiosInstance from "@/utils/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchPlans = async (): Promise<FetchPlansResponse> => {
	try {
		const response = await axiosInstance.get("/subscriptions/plans");
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const createSubscriptionSession = async (
	payload: CreateSessionPayload,
): Promise<CreateSessionResponse> => {
	try {
		const response = await axiosInstance.post(
			"/subscriptions/sessions",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const updateCard = async () => {
	try {
		const response = await axiosInstance.get(
			"/subscriptions/billing-portal",
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const fetchUserSubscription = async () => {
	try {
		const response = await axiosInstance.get("/subscriptions/");
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const cancelUserSubscription = async (
	payload: CancelSubscriptionPayload,
) => {
	try {
		const response = await axiosInstance.post(
			"/subscriptions/cancel",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const updateSubscription = async (payload: UpdateSessionPayload) => {
	try {
		const response = await axiosInstance.post(
			"/subscriptions/update",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(error?.response?.data?.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
