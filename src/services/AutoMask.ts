import { CreateMaskProps, FetchMaskProps } from "@/types/masking";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

export const createMask = async (payload: CreateMaskProps) => {
	try {
		const response = await axiosInstance.post(
			"/re-imagine/auto-mask",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(
				"Error creating masking " + error?.response?.data?.message,
			);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const getMask = async ({ maskingUuid }: FetchMaskProps) => {
	try {
		const response = await axiosInstance.get(
			`/re-imagine/auto-mask/${maskingUuid}`,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(
				"Error fetching masking" + error?.response?.data?.message,
			);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
