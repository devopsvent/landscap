import axiosInstance from "@/utils/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const markFavorites = async (AiImageUuid: string, favorite: boolean) => {
	try {
		const response = await axiosInstance.patch(
			`/re-imagine/generate-images/ai-images/${AiImageUuid}`,
			{ favorite },
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(
				"Failed to mark as favorite: " + error?.response?.data?.message,
			);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const getFavorites = async () => {
	try {
		const response = await axiosInstance.get(
			"/re-imagine/generate-images/favorites",
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(
				"Error fetching favorites " + error?.response?.data?.message,
			);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
