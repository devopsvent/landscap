import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

export const fetchGardenStyles = async (
	setLoading: (loading: boolean) => void,
) => {
	try {
		setLoading(true);
		const response = await axiosInstance.get("/re-imagine/garden-styles");
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error fetching garden styles " + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	} finally {
		setLoading(false);
	}
};
