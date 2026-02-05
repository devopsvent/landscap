"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import Swipers from "../../../ui/Swiper";
import { useImage } from "@/context/ImageContext";
import { fetchAiImages } from "@/services/GenerateImages";
import { Skeleton } from "primereact/skeleton";
import ShareDialog from "@/ui/ShareDialog";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import DeleteDialog from "@/ui/DeleteDialog";
import AutoMaskImageBox from "./AutoMaskImageBox";
import GenerateReportDialog from "@/ui/GenerateReportDialog";
import { ReportData } from "@/types/automask-delete-dialog";

const GenerateAiImages = () => {
	const [images, setImages] = useState([]);
	const [styleName, setStyleName] = useState("");
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [showGenerateReport, setShowGenerateReport] = useState(false);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [showDeleteBottomSheet, setShowDeleteBottomSheet] = useState(false);
	const [overlayDeleteVisible, setOverlayDeleteVisible] = useState(false);
	const {
		AiImageUuid,
		selectedImage,
		setSelectedImage,
		setSelectedMaskUrls,
		setSelectedStyleId,
		setYardType,
	} = useImage();
	const [loading, setLoading] = useState(false);
	const [deleteSessionLoader, setDeleteSessionLoader] = useState(false);
	const [report, setReport] = useState<ReportData | undefined>(undefined);
	const router = useRouter();
	const params = useParams();
	const uuidParam = Array.isArray(params?.uuid)
		? params.uuid[0]
		: params?.uuid;

	const pollImages = async () => {
		if (typeof window === "undefined") return;
		const imageUuid = AiImageUuid || uuidParam;
		if (!imageUuid) return;
		try {
			const response = await fetchAiImages({ imageUuid });
			const imageData = response.data;

			if (imageData.status === "DONE") {
				setSelectedImage(imageData.imageUrl);
				setImages(imageData.generatedImages);
				setStyleName(imageData.selectedStyle);

				setReport(imageData);
				setLoading(false);
				return true;
			}

			if (imageData.status === "ERROR") {
				toast.error("Failed to generate images. Please try again.");
				setLoading(false);
				return true;
			}

			if (
				imageData.status === "PROCESSING" ||
				imageData.status === "QUEUED"
			) {
				return false;
			}
		} catch (error) {
			console.error("Polling error:", error);
			setLoading(false);
			toast.error(
				"Something went wrong while polling. Please try again later.",
			);
			return true;
		}
	};

	useEffect(() => {
		setLoading(true);
		const pollingInterval = setInterval(async () => {
			const isDone = await pollImages();
			if (isDone) clearInterval(pollingInterval);
		}, 2000);

		return () => clearInterval(pollingInterval);
	}, [AiImageUuid]);

	const handleGenerateReport = () => {
		setShowGenerateReport(true);
	};

	const handleSelectShareSession = () => {
		setShowBottomSheet(true);
		setOverlayVisible(true);
	};

	const handleDeleteModal = () => {
		setShowDeleteBottomSheet(true);
		setOverlayDeleteVisible(true);
	};

	const handleDeleteSession = async () => {
		try {
			setDeleteSessionLoader(true);
			setSelectedMaskUrls([]);
			setSelectedStyleId(null);
			setYardType(null);
			localStorage.setItem("AiImageUuid", "");
			setSelectedImage("");
			toast.success("Session has been deleted successfully");
			router.replace("/dashboard");
		} catch (error) {
			toast.error("Something went wrong while deleting the session");
			console.error(error);
		} finally {
			setDeleteSessionLoader(false);
		}
	};

	return (
		<div className='home-container bg-green-50 pl-4'>
			<div className='mx-auto w-full max-w-5xl'>
				{/* Share & Delete Button */}
				<div className='custom-border align-items-center flex flex-shrink-0 px-2'>
					<i
						className='pi pi-arrow-left mr-2 cursor-pointer text-xl'
						onClick={() => router.push("/dashboard/garden-styles")}
					></i>
					<h2 className='ml-3 text-2xl font-semibold'>Ideas</h2>
					<div className='justify-content-end ml-auto flex gap-2'>
						<div
							onClick={report ? handleGenerateReport : undefined}
							className={`bg-pinkIcon align-items-center justify-content-center flex gap-2 rounded-full border-none p-3 text-white ${!report ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
						>
							<span className='flex'>
								<i className='pi pi-file' />
							</span>
						</div>

						<div
							onClick={handleSelectShareSession}
							className='bg-green align-items-center justify-content-center flex gap-2 rounded-full border-none p-3 text-white'
						>
							<span className='flex'>
								<i className='pi pi-share-alt' />
							</span>
						</div>
						<div
							className='bg-red align-items-center justify-content-center flex gap-2 rounded-full border-none p-3 text-white'
							onClick={handleDeleteModal}
						>
							<span className='flex'>
								<i className='pi pi-trash' />
							</span>
						</div>
					</div>
				</div>
				<div>
					<p className='text-xl'>Original</p>
				</div>

				{loading ? (
					<Skeleton
						width='550px'
						height='400px'
						className='border-round-3xl mx-auto mb-5'
					></Skeleton>
				) : (
					<div className='relative'>
						<img
							src={selectedImage!}
							alt='Uploaded Image'
							className='preview-images rounded-lg'
						/>
						<AutoMaskImageBox />
					</div>
				)}

				<div className='custom-swipers align-items-center justify-content-center flex'>
					<Swipers
						loading={loading}
						images={images}
						pollImages={pollImages}
						styleName={styleName}
					/>
				</div>

				<GenerateReportDialog
					showGenerateReport={showGenerateReport}
					setShowGenerateReport={setShowGenerateReport}
					report={report}
				/>

				<ShareDialog
					overlayVisible={overlayVisible}
					setOverlayVisible={setOverlayVisible}
					showBottomSheet={showBottomSheet}
					setShowBottomSheet={setShowBottomSheet}
					images={images}
				/>
				<DeleteDialog
					overlayDeleteVisible={overlayDeleteVisible}
					setOverlayDeleteVisible={setOverlayDeleteVisible}
					showDeleteBottomSheet={showDeleteBottomSheet}
					setShowDeleteBottomSheet={setShowDeleteBottomSheet}
					handleDeleteSession={handleDeleteSession}
					loading={deleteSessionLoader}
				/>
			</div>
		</div>
	);
};

export default GenerateAiImages;
