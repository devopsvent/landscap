"use client";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "./index.css";
import Image from "next/image";
import BottomForm from "@/ui/BottomForm";
import info from "../../../assets/info.png";
import { useUser } from "@/context/UserContext";
import { fetchYardTypes } from "@/services/YardTypes";
import { YardTypes } from "@/types/automask-gallery";
import { fetchGardenStyles } from "@/services/GardenStyles";
import { GardenStyle } from "@/types/GardenStyle";
import { Skeleton } from "primereact/skeleton";
import { useImage } from "@/context/ImageContext";
import { generateAiImages } from "@/services/GenerateImages";
import { GenerateAiImages } from "@/types/AiImages";
import loadingicon from "../../../assets/loadingicon.png";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import SubscriptionDialog from "@/ui/SubscriptionDialog";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZipFormValues, zipSchema } from "@/schema/ZipCode";

const GardenStyles = () => {
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [loading, setLoading] = useState(false);
	const [reImagineLoading, setReImagineLoading] = useState(false);
	const [yardTypeData, setYardTypeData] = useState<YardTypes[]>();
	const [gardenStyles, setGardenStyles] = useState<GardenStyle[]>();
	const router = useRouter();
	const { user } = useUser();
	const {
		yardType,
		setYardType,
		selectedStyleId,
		setSelectedStyleId,
		selectedImage,
		selectedMaskUrls,
		setAiImageUuid,
		yardOnASlope,
		setYardOnASlope,
	} = useImage();

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<ZipFormValues>({
		resolver: zodResolver(zipSchema),
	});
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	const loadYardTypes = async () => {
		const data = await fetchYardTypes();
		setYardTypeData(
			data?.data?.map((item: { id: number; name: string }) => ({
				label: item.name,
				value: item.id,
			})),
		);
	};

	const loadGardenStyles = async () => {
		const gardenStyles = await fetchGardenStyles(setLoading);
		setGardenStyles(gardenStyles.data);
	};

	useEffect(() => {
		loadYardTypes();
		loadGardenStyles();
	}, []);

	const handleSelectSettings = () => {
		setShowBottomSheet(true);
		setOverlayVisible(true);
	};

	const createCardHeader = (
		style:
			| {
					id: number;
					name: string;
					description: string;
					imageUrl: string;
					dimensions: string;
			  }
			| {
					id: number;
					name: string;
					description: string;
					imageUrl: string;
					dimensions?: undefined;
			  },
		index: number,
	) => {
		const isSelected = selectedStyleId === style.id;

		return (
			<div className='relative'>
				{index === 0 && style.dimensions && (
					<div className='dimensions-badge absolute left-2 top-2 z-10 rounded-md bg-blue-500 px-3 py-1 text-sm text-white'>
						{style.dimensions}
					</div>
				)}
				<div className='relative'>
					<img
						alt={`${style.name} Garden Style`}
						src={style.imageUrl || "/placeholder.svg"}
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								"https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
						}}
						className={`garden-image h-44 w-full object-cover ${isSelected ? "selected-image" : ""}`}
						width={100}
						height={100}
					/>
					{isSelected && (
						<div className='selected-overlay'>
							<div className='checkmark-icon'>
								<i
									className='pi pi-check'
									style={{
										fontSize: "2rem",
									}}
								></i>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	const handleCardSelect = (id: number) => {
		setSelectedStyleId(id);
	};

	const handleGenerateImages = async () => {
		try {
			setReImagineLoading(true);
			const { zipCode } = getValues();
			const payload: GenerateAiImages = {
				imageUrl: selectedImage!,
				maskUrls: selectedMaskUrls,
				yardTypeId: yardType!,
				gardenStyleId: selectedStyleId!,
				zipCode: zipCode,
				yardOnASlope: yardOnASlope,
			};
			const generateImageResponse = await generateAiImages(payload);
			setAiImageUuid(generateImageResponse?.data?.uuid);
			localStorage.setItem(
				"AiImageUuid",
				generateImageResponse?.data?.uuid,
			);
			router.push(
				`/dashboard/generate-images/${generateImageResponse?.data?.uuid}`,
			);
		} catch (error) {
			console.error(error);
			if (isAxiosError(error)) {
				const errorMessage =
					error?.response?.data?.message || error?.message;
				if (errorMessage?.includes("Image generation limit exceeded")) {
					setShowUpgradeModal(true);
				}
			}
		} finally {
			setReImagineLoading(false);
		}
	};

	return (
		<div className='home-container relative min-h-screen bg-green-50 pb-16 pl-4 pr-4'>
			<div className='mx-auto w-full max-w-5xl'>
				{/* Settings Button */}

				<div className='custom-border align-items-center flex flex-shrink-0 px-2'>
					<i
						className='pi pi-arrow-left mr-2 cursor-pointer text-xl'
						onClick={() => router.push("/dashboard/automask")}
					></i>
					<h2 className='ml-3 text-2xl font-semibold'>
						Select Your Style
					</h2>
					<div className='align-items-center justify-content-end ml-auto flex'>
						<span
							style={{
								color: "#FFA530",
								marginRight: "0.5rem",
							}}
						>
							Tab the style you like!
						</span>
						<Button
							onClick={handleSelectSettings}
							className='bg-orange align-items-center justify-content-center flex gap-2 rounded-full border-none px-5 py-3 text-lg text-white'
						>
							<span className='align-items-center flex'>
								Settings
								<i className='pi pi-cog ml-2' />
							</span>
						</Button>
					</div>
				</div>
				<form onSubmit={handleSubmit(handleGenerateImages)}>
					{/* AutoMask Information */}
					<div className='justify-content-between align-items-center mt-4 flex px-2'>
						<div className='align-items-center flex'>
							<Image
								alt='info'
								src={info}
								width={25}
								height={25}
							/>
							<p className='ml-1 text-xl font-medium'>
								Yard Information
							</p>
						</div>
					</div>

					{reImagineLoading && (
						<div className='loader-overlay'>
							<div className='loader-wrapper'>
								<div className='spinner'></div>
								<Image
									src={loadingicon}
									alt='logo'
									className='loader-image'
								/>
							</div>
						</div>
					)}

					<div className='state mb-2 mt-1'>
						{loading ? (
							<Skeleton width='5rem' className='mt-2'></Skeleton>
						) : (
							<div className='flex items-center gap-3'>
								<p>
									<i className='pi pi-globe' />
									<span className='mx-1 text-lg'>
										{user?.addresses.country} |
									</span>
									<i className='pi pi-map-marker' />
									<span className='ml-1 text-lg'>
										{user?.addresses.state}
									</span>
								</p>
								<span className='flex-column flex'>
									<InputText
										id='zipcode'
										className='p-inputtext-rounded mt-1 w-24'
										placeholder='Enter your zipcode'
										{...register("zipCode")}
										pt={{
											root: {
												className: "custom-input",
											},
										}}
									/>
									{errors.zipCode && (
										<small className='p-error mt-2'>
											{errors.zipCode.message}
										</small>
									)}
								</span>
							</div>
						)}
					</div>

					{/* Floating Re-Imagine Button */}
					<div className='reimagine-button-container'>
						<Button
							type='submit'
							label={
								reImagineLoading
									? "Re-Imagining Image"
									: "Re-imagine"
							}
							className={
								reImagineLoading
									? "bg-orange w-3 rounded-full border-none px-8 py-3 text-white shadow-lg"
									: "bg-orange w-auto rounded-full border-none px-8 py-3 text-white shadow-lg"
							}
							disabled={!selectedStyleId}
						/>
					</div>

					{/* Garden Style Cards Grid using PrimeReact Grid */}
					<div className='grid'>
						{loading
							? Array.from({ length: 6 }).map((_, i) => (
									<div
										key={i}
										className='col-12 md:col-6 lg:col-4 p-2'
									>
										<Card className='garden-card-style h-full'>
											<div className='mb-3'>
												<Skeleton
													height='176px'
													className='w-full'
												/>
											</div>
											<Skeleton
												width='80%'
												className='mb-2'
											/>
											<Skeleton
												width='100%'
												height='1.5rem'
											/>
										</Card>
									</div>
								))
							: gardenStyles?.map((style, index) => (
									<div
										key={style.id}
										className='col-12 md:col-6 lg:col-4 pb-5'
									>
										<Card
											className={`garden-card-style h-full cursor-pointer ${selectedStyleId === style.id ? "selected-card" : ""}`}
											header={createCardHeader(
												style,
												index,
											)}
											style={{
												margin: 0,
												border: "none",
											}}
											onClick={() =>
												handleCardSelect(style.id)
											}
										>
											<h3 className='m-0 text-lg font-semibold'>
												{style.name}
											</h3>
											<Tooltip
												target='.description-tooltip'
												position='top'
												className='custom-square-tooltip'
												pt={{
													root: {
														className:
															"bg-gray-800 text-white p-3 rounded-none",
													},
													arrow: {
														className: "hidden",
													},
												}}
												mouseTrack
												mouseTrackTop={10}
											/>
											<p
												className='description-tooltip m-0 mt-1 line-clamp-3 text-sm text-gray-600'
												data-pr-tooltip={
													style.description
												}
												data-pr-position='top'
												data-pr-at='center top-5'
											>
												{style.description}
											</p>
										</Card>
									</div>
								))}
					</div>
				</form>
			</div>
			<BottomForm
				overlayVisible={overlayVisible}
				setOverlayVisible={setOverlayVisible}
				showBottomSheet={showBottomSheet}
				setShowBottomSheet={setShowBottomSheet}
				yardType={yardType}
				yardTypes={yardTypeData!}
				setYardType={setYardType}
				yardOnASlope={yardOnASlope}
				setYardOnASlope={setYardOnASlope}
			/>
			{showUpgradeModal && (
				<SubscriptionDialog
					showUpgradeModal={showUpgradeModal}
					setShowUpgradeModal={setShowUpgradeModal}
				/>
			)}
		</div>
	);
};

export default GardenStyles;
