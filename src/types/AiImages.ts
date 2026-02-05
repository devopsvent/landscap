export interface GenerateAiImages {
	imageUrl: string;
	maskUrls: string[];
	yardTypeId: number;
	gardenStyleId: number;
	zipCode: string;
	yardOnASlope: boolean;
}

export interface FetchAiImages {
	imageUuid: string;
}

export interface GeneratedImage {
	id: number;
	uuid: string;
	imageUrl: string;
	favorite: boolean;
	reImagineImageGenerationId: number;
	createdAt: string;
	updatedAt: string;
}

export interface SwipersProps {
	images: GeneratedImage[];
	styleName?: string;
	loading: boolean;
	pollImages: () => Promise<boolean | undefined>;
}
