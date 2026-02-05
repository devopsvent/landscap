"use client";

import amplifyConfig from "@/utils/amplify-config";
import { Amplify } from "aws-amplify";
import React, { createContext, useContext, useState } from "react";

interface ImageContextType {
	selectedImage: string | null;
	setSelectedImage: (image: string) => void;
	uuid: string;
	setUuid: (uuid: string) => void;
	selectedMaskUrls: string[];
	setSelectedMaskUrls: React.Dispatch<React.SetStateAction<string[]>>;
	yardType: number | null;
	setYardType: (type: number | null) => void;
	selectedStyleId: number | null;
	setSelectedStyleId: (id: number | null) => void;
	AiImageUuid: string;
	setAiImageUuid: (uuid: string) => void;
	yardOnASlope: boolean;
	setYardOnASlope: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

Amplify.configure(amplifyConfig, { ssr: true });

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [uuid, setUuid] = useState("");
	const [AiImageUuid, setAiImageUuid] = useState("");
	const [selectedMaskUrls, setSelectedMaskUrls] = useState<string[]>([]);
	const [yardType, setYardType] = useState<number | null>(null);
	const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
	const [yardOnASlope, setYardOnASlope] = useState<boolean>(false);

	return (
		<ImageContext.Provider
			value={{
				selectedImage,
				setSelectedImage,
				uuid,
				setUuid,
				selectedMaskUrls,
				setSelectedMaskUrls,
				yardType,
				setYardType,
				selectedStyleId,
				setSelectedStyleId,
				AiImageUuid,
				setAiImageUuid,
				yardOnASlope,
				setYardOnASlope,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
};

export const useImage = (): ImageContextType => {
	const context = useContext(ImageContext);
	if (!context) {
		throw new Error("useImage must be used within an ImageProvider");
	}
	return context;
};
