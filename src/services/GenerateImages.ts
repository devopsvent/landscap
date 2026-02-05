import { FetchAiImages, GenerateAiImages } from "@/types/AiImages";
import axiosInstance from "@/utils/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const generateAiImages = async (payload: GenerateAiImages) => {
	try {
		const response = await axiosInstance.post(
			"/re-imagine/generate-images",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			const errorMessage =
				error?.response?.data?.message || error?.message;

			if (!errorMessage?.includes("Image generation limit exceeded")) {
				toast.error("Error while generating Images " + errorMessage);
			}
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const fetchAiImages = async ({ imageUuid }: FetchAiImages) => {
	try {
		const response = await axiosInstance.get(
			`/re-imagine/generate-images/${imageUuid}`,
		);
		return response.data;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			toast.error(
				"Error while fetching Reimagined Images" +
					error?.response?.data?.message,
			);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
