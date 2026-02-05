import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

export const fetchYardTypes = async () => {
	try {
		const response = await axiosInstance.get("/re-imagine/yard-types");
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error fetching yard types " + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
