"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import Image from "next/image";
import "../index.css";
import UploadImage from "./UploadImage";
import { getPresignedUrl, uploadToS3 } from "@/services/UploadYardImageService";
import { useRouter } from "next/navigation";
import { googleStreetView } from "@/services/GoogleStreetView";
import { useImage } from "@/context/ImageContext";
import AddressbarWrapper from "@/context/AddressbarWrapper";
import { CreateMaskProps } from "@/types/masking";
import { createMask } from "@/services/AutoMask";
import toast from "react-hot-toast";
import loadingicon from "../../../assets/loadingicon.png";
import { getImageDimensions } from "@/utils/image-dimension";

const Home = () => {
	const [address, setAddress] = useState("");
	const [fileName, setFileName] = useState("");
	const [imageLoading, setImageLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [addressLoading, setAddressLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const router = useRouter();
	const {
		selectedImage,
		setSelectedImage,
		setUuid,
		setSelectedMaskUrls,
		setSelectedStyleId,
		setYardType,
	} = useImage();

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const sampleImages = [
		"https://d3h3p2b93tioab.cloudfront.net/sample-garden-images/sample_garden_image.png",
	];

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		try {
			if (!file) return;
			setImageLoading(true);
			const imageDimensions = await getImageDimensions(file);
			if (imageDimensions.width < 512 && imageDimensions.height < 512) {
				toast.error("Image must be at least 512 x 512 pixels.");
				setImageLoading(false);
				return;
			}
			setFileName(file.name);
			const { url, key } = await getPresignedUrl();
			const UploadImageURL = `${url}`;
			await uploadToS3(UploadImageURL, file);
			const imageUrl = `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${key}`;
			setPreviewUrl(imageUrl);
			setSelectedImage(imageUrl);
			setSelectedMaskUrls([]);
			setSelectedStyleId(null);
			setYardType(null);
		} catch (err) {
			console.error("Upload failed", err);
		} finally {
			setImageLoading(false);
		}
	};
	useEffect(() => {
		const handleAddressChange = async () => {
			if (!address) return;
			setAddressLoading(true);
			try {
				const payload = {
					address: address,
				};
				const result = await googleStreetView(payload);
				setPreviewUrl(result.data.streetViewImageUrl);
				setSelectedImage(result.data.streetViewImageUrl);
				setSelectedMaskUrls([]);
				setSelectedStyleId(null);
				setYardType(null);
			} catch (error) {
				console.error("API error", error);
			} finally {
				setAddressLoading(false);
			}
		};
		handleAddressChange();
	}, [address]);

	const handleUseImage = async () => {
		try {
			if (!previewUrl.length) {
				toast.error(
					"Please upload image or select from sample image to proceed",
				);
				return 0;
			}
			setIsLoading(true);
			const payload: CreateMaskProps = {
				imageUrl: selectedImage!,
			};
			const createResponse = await createMask(payload);
			setUuid(createResponse?.data?.uuid);
			localStorage.setItem("maskingUuid", createResponse?.data?.uuid);
			setSelectedMaskUrls([]);
			setSelectedStyleId(null);
			setYardType(null);
			router.push("/dashboard/automask");
		} catch (error) {
			console.error("AutoMask error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='home-dashboard-container bg-green-50 pl-4'>
			<div className='mx-auto w-full max-w-5xl'>
				{previewUrl.length > 0 ? (
					<div className='custom-border align-items-center mb-4 flex px-2'>
						<i
							className='pi pi-arrow-left mr-2 cursor-pointer text-xl'
							onClick={() => {
								setPreviewUrl("");
								setSelectedImage("");
							}}
						></i>
						<h2 className='ml-2 text-2xl font-semibold'>
							Your Yard Image
						</h2>
					</div>
				) : (
					<h2 className='mb-5 text-2xl font-semibold'>
						Your Yard Image
					</h2>
				)}

				{/* Upload Image Box */}

				{imageLoading || addressLoading ? (
					<>
						<div className='loader-overlay-automask'>
							<div className='loader-wrapper-automask'>
								<div className='spinner'></div>
								<Image
									src={loadingicon}
									alt='logo'
									className='loader-image-automask'
								/>
							</div>
						</div>
						<UploadImage
							handleClick={handleClick}
							handleFileChange={handleFileChange}
							fileName={fileName}
							fileInputRef={fileInputRef}
							previewUrl={previewUrl}
						/>
					</>
				) : previewUrl.length > 0 ||
				  (selectedImage && selectedImage.length > 0) ? (
					<img
						src={previewUrl}
						alt='Uploaded Image'
						className='preview-image mx-auto flex rounded-3xl object-contain'
					/>
				) : (
					<UploadImage
						handleClick={handleClick}
						handleFileChange={handleFileChange}
						fileName={fileName}
						fileInputRef={fileInputRef}
						isLoading={imageLoading}
						previewUrl={previewUrl}
					/>
				)}
				{/* Use Address Input */}
				{!previewUrl.length && (
					<>
						<AddressbarWrapper setAddress={setAddress} />

						{/* Sample Images Selection */}
						<div className='mb-6'>
							<label className='text-md mb-2 block font-medium'>
								Use sample image
							</label>
							<div className='mt-4 flex gap-4'>
								{sampleImages.map((img, index) => (
									<div
										key={index}
										className='flex flex-col items-center'
									>
										<RadioButton
											inputId={`img${index}`}
											name='sample'
											value={img}
											onChange={(e) => {
												setSelectedImage(e.value);
												setPreviewUrl(e.value);
											}}
											checked={selectedImage === img}
											className='mt-5'
										/>
										<label
											htmlFor={`img${index}`}
											className='cursor-pointer'
										>
											<Image
												src={img}
												alt={`Sample ${index + 1}`}
												width={100}
												height={80}
												className='sample-image mt-2 rounded-lg border border-gray-300'
											/>
										</label>
									</div>
								))}
							</div>
						</div>
					</>
				)}

				{/* Use Image Button */}
				<div className='text-left'>
					<Button
						label='Use Image'
						className='bg-orange rounded-full border-none px-5 py-3 text-white'
						onClick={handleUseImage}
						icon={isLoading ? "pi pi-spin pi-spinner" : ""}
						disabled={isLoading}
					/>
				</div>

				{/* Feedback Footer */}
				{/* <div className='justify-content-end absolute bottom-2 right-2 flex text-sm text-gray-500'>
					<span className='pi pi-comment mr-2 text-orange-400' />{" "}
					Provide feedback
				</div> */}
			</div>
		</div>
	);
};

export default Home;
