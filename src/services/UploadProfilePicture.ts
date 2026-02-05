import { s3axiosInstance } from "@/utils/axios";
import { fetchAuthSession } from "aws-amplify/auth";
import toast from "react-hot-toast";

export const getPresignedUrl = async () => {
	try {
		const session = await fetchAuthSession();
		const token = session.tokens?.idToken?.toString();

		const response = await s3axiosInstance.get(
			"/generate-profile-picture-presigned-url",
			{
				params: { contentType: "image/jpeg" },
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Error getting presigned URL " + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};

export const uploadToS3 = async (url: string, file: File) => {
	try {
		const response = await s3axiosInstance.put(url, file, {
			headers: {
				"Content-Type": file.type,
			},
		});
		toast.success("Image uploaded successfully!");
		return response;
	} catch (error: unknown) {
		if (error instanceof Error) {
			toast.error("Failed to upload image" + error.message);
		} else {
			toast.error("An unknown error occurred.");
		}
		throw error;
	}
};
