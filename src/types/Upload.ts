export type UploadImageProps = {
	handleClick: () => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	fileName: string;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	isLoading?: boolean;
	previewUrl?: string;
};
