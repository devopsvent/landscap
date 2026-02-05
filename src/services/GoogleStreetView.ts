import { googleStreetViewProps } from "@/types/dashboard";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

export const googleStreetView = async (payload: googleStreetViewProps) => {
	try {
		const response = await axiosInstance.post(
			"/google-maps/street-view",
			payload,
		);
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error fetching street view" + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
