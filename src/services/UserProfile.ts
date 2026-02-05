import { UpdateUserData } from "@/types/profile";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

export const fetchUserProfile = async (
	setLoading: (loading: boolean) => void,
) => {
	try {
		setLoading(true);
		const response = await axiosInstance.get("/users");
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error fetching user information " + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	} finally {
		setLoading(false);
	}
};

export const updateUserProfile = async (data: UpdateUserData) => {
	try {
		const response = await axiosInstance.patch("/users", data);
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error updating user Profile" + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
