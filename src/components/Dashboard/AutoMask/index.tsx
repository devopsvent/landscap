"use client";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import "./index.css";
import { useImage } from "@/context/ImageContext";
import { useRouter } from "next/navigation";
import { MaskProps } from "@/types/masking";
import { getMask } from "@/services/AutoMask";
import { Skeleton } from "primereact/skeleton";

const AutoMask = () => {
	const router = useRouter();
	const { uuid, setSelectedImage } = useImage();
	const [loading, setLoading] = useState(true);
	const [undoStack, setUndoStack] = useState<string[][]>([]);
	const [redoStack, setRedoStack] = useState<string[][]>([]);
	const [maskData, setMaskData] = useState<MaskProps>();
	const { selectedMaskUrls, setSelectedMaskUrls } = useImage();

	useEffect(() => {
		if (typeof window === "undefined") return;
		const maskingUuid = uuid || localStorage.getItem("maskingUuid");
		if (!maskingUuid) return;
		const pollMaskingStatus = async () => {
			try {
				if (!maskingUuid) throw new Error("UUID not returned");

				const response = await getMask({ maskingUuid });

				if (response?.data?.autoMaskJob?.status === "COMPLETED") {
					setSelectedImage(
						`${response.data.autoMaskJob.imageUrl}?v=${Date.now()}`,
					);
					clearInterval(pollingInterval);
					setMaskData({
						...response.data.autoMaskJob,
						imageUrl: `${response.data.autoMaskJob.imageUrl}?v=${Date.now()}`,
					});
					setLoading(false);
				}
			} catch (error) {
				console.error("AutoMask polling error:", error);
				clearInterval(pollingInterval);
				setLoading(false);
			}
		};

		const pollingInterval = setInterval(pollMaskingStatus, 2000);

		return () => clearInterval(pollingInterval);
	}, [uuid]);

	const handleImageClick = (e: React.MouseEvent) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const clickY = e.clientY - rect.top;

		// Step 1: Find masks where click is inside the bounding box
		const clickableMasks = maskData?.masks?.filter((mask) => {
			const { x, y, width, height } = mask.bbox;
			return (
				clickX >= x &&
				clickX <= x + width &&
				clickY >= y &&
				clickY <= y + height
			);
		});

		// Step 2: If multiple matches, choose the closest one to center_point
		const closest = clickableMasks?.reduce((prev, curr) => {
			const prevDist = Math.hypot(
				prev.center_point.x - clickX,
				prev.center_point.y - clickY,
			);
			const currDist = Math.hypot(
				curr.center_point.x - clickX,
				curr.center_point.y - clickY,
			);
			return currDist < prevDist ? curr : prev;
		}, clickableMasks[0]);

		// Step 3: Apply mask toggle
		if (closest?.mask_url) {
			setUndoStack((prev) => [...prev, selectedMaskUrls]);
			setRedoStack([]);

			setSelectedMaskUrls((prev: string[]) => {
				return prev.includes(closest.mask_url)
					? prev.filter((url) => url !== closest.mask_url)
					: [...prev, closest.mask_url];
			});
		}
	};

	const handleUndo = () => {
		if (undoStack.length === 0) return;

		const lastState = undoStack[undoStack.length - 1];
		setUndoStack((prev) => prev.slice(0, -1));
		setRedoStack((prev) => [...prev, selectedMaskUrls]);
		setSelectedMaskUrls(lastState);
	};

	const handleRedo = () => {
		if (redoStack.length === 0) return;

		const nextState = redoStack[redoStack.length - 1];
		setRedoStack((prev) => prev.slice(0, -1));
		setUndoStack((prev) => [...prev, selectedMaskUrls]);
		setSelectedMaskUrls(nextState);
	};

	return (
		<div className='home-container overflow-hidden bg-green-50 pl-4'>
			<div className='mx-auto w-full max-w-5xl'>
				{/* Toggle Button */}
				<div className='custom-border align-items-center flex flex-shrink-0 px-2'>
					<i
						className='pi pi-arrow-left mr-2 cursor-pointer text-xl'
						onClick={() => {
							setSelectedImage("");
							router.push("/dashboard");
						}}
					></i>
					<h2 className='ml-3 text-2xl font-semibold'>Tag Yard</h2>
					{/* <div className='flex justify-content-end'>
						<ToggleButton />
					</div> */}
				</div>
				{/* Undo/Redo Button */}
				<div className='justify-content-between align-items-center flex px-2'>
					<div className='align-items-center flex'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='26'
							height='25'
							viewBox='0 0 26 25'
							fill='none'
						>
							<path
								d='M25.1892 11.818V13.4572C25.1513 13.758 25.1186 14.0596 25.0747 14.3596C24.7772 16.3953 24.0445 18.2591 22.8152 19.9108C20.7816 22.6434 18.0794 24.2929 14.7116 24.8377C14.3655 24.8937 14.0165 24.9327 13.6687 24.9796H12.0298C11.9606 24.964 11.892 24.9393 11.822 24.9341C10.4822 24.8358 9.18545 24.5371 7.97024 23.971C3.55373 21.9132 1.05031 18.465 0.557029 13.6018C0.366843 11.7262 0.657615 9.90208 1.35049 8.15166C3.46914 2.80045 8.82241 -0.347242 14.531 0.407141C16.6059 0.681383 18.4976 1.44737 20.1715 2.70584C22.874 4.73765 24.5077 7.42795 25.0473 10.7728C25.1032 11.1198 25.1424 11.4695 25.1892 11.818ZM9.15188 11.7915C9.30654 11.743 9.41677 11.6932 9.53188 11.6752C9.87759 11.6213 10.2256 11.5405 10.5724 11.5422C11.1286 11.5449 11.3767 11.8079 11.3898 12.3651C11.3959 12.6274 11.3781 12.8988 11.3152 13.1524C11.1074 13.9916 10.8794 14.826 10.6492 15.6595C10.438 16.4239 10.2049 17.1821 10.1607 17.9822C10.12 18.7163 10.3446 19.3254 10.9671 19.7512C11.6781 20.2376 12.4885 20.2806 13.2809 20.1202C13.9728 19.9801 14.6341 19.6865 15.3079 19.4578C15.3491 19.4439 15.4049 19.4107 15.4147 19.3756C15.4857 19.1196 15.5468 18.8608 15.6192 18.5691C15.4539 18.6245 15.3408 18.665 15.2261 18.7002C14.8308 18.8217 14.4318 18.881 14.0165 18.8083C13.62 18.7389 13.4271 18.5843 13.3626 18.1845C13.3285 17.9743 13.3189 17.7458 13.3638 17.5399C13.5224 16.8129 13.7041 16.0907 13.8865 15.3691C14.143 14.3541 14.5427 13.3722 14.5647 12.304C14.5757 11.7717 14.4717 11.2812 14.0979 10.8832C13.4563 10.2001 12.6264 10.1203 11.7647 10.2038C10.9579 10.282 10.2199 10.6121 9.47256 10.8989C9.41897 10.9194 9.35061 10.9667 9.33718 11.0149C9.26968 11.2584 9.21804 11.5063 9.15188 11.7915ZM13.9253 8.56154C14.033 8.55481 14.1291 8.54973 14.2251 8.54274C15.2887 8.46518 16.0626 7.33438 15.7473 6.31901C15.424 5.27775 14.1395 4.73802 13.1332 5.2206C12.2411 5.64836 11.8555 6.52823 12.1719 7.4137C12.4063 8.06949 13.1533 8.55543 13.9253 8.56154Z'
								fill='#FFA530'
							/>
						</svg>
						<p className='ml-1'>
							Tap the areas of the yard to re-imagine
						</p>
					</div>
					<div className='my-2 flex'>
						{/* Undo button and label */}
						<div className='flex-column align-items-center flex'>
							<Button
								className='undo-color border-round-lg'
								disabled={undoStack.length === 0}
								onClick={handleUndo}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='23'
									height='28'
									viewBox='0 0 23 28'
									fill='none'
								>
									<path
										d='M11.7054 0V4.85497C15.6192 4.97804 18.7212 6.61496 20.9353 9.81236C22.5887 12.1999 23.1814 14.8873 22.7127 17.7552C21.7093 23.8915 16.0696 27.8057 10.3838 27.0886C4.06815 26.2921 0.419715 20.7157 0.589148 16.0356H3.34379C3.44242 18.9621 4.66386 21.2908 7.06498 22.9447C8.80619 24.1442 10.7669 24.5834 12.8638 24.2826C17.4463 23.6252 20.46 19.4976 20.0122 15.2021C19.5179 10.4571 15.4183 7.59218 11.71 7.69832V13.8614C11.6841 13.8786 11.6578 13.8958 11.6316 13.913C9.34452 11.5966 7.05717 9.2803 4.70463 6.89796C4.78617 6.8459 4.89017 6.80257 4.9639 6.72893C7.13602 4.56189 9.30521 2.39201 11.4737 0.221298C11.5403 0.154587 11.5931 0.0740662 11.6524 0H11.7054Z'
										fill={
											!undoStack.length
												? "#D5AA6D"
												: "white"
										}
									/>
								</svg>
							</Button>
							<span className='mt-1 text-sm'>Undo</span>
						</div>
						{/* Redo button and label */}
						<div className='flex-column align-items-center flex'>
							<Button
								className='redo-color border-round-lg'
								disabled={redoStack.length === 0}
								onClick={handleRedo}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='23'
									height='28'
									viewBox='0 0 23 28'
									fill='none'
								>
									<path
										d='M11.5216 0V4.85497C7.60777 4.97804 4.50572 6.61496 2.29161 9.81236C0.638163 12.1999 0.0453897 14.8873 0.51414 17.7552C1.51768 23.8915 7.15733 27.8057 12.8432 27.0886C19.1589 26.2921 22.8074 20.7157 22.6379 16.0356H19.8833C19.7846 18.9621 18.5632 21.2908 16.1621 22.9447C14.4209 24.1442 12.4602 24.5834 10.3631 24.2826C5.78062 23.6252 2.76695 19.4976 3.2147 15.2021C3.70909 10.4571 7.8087 7.59218 11.5169 7.69832V13.8614C11.5428 13.8786 11.5692 13.8958 11.5953 13.913C13.8825 11.5966 16.1699 9.2803 18.5224 6.89796C18.4409 6.8459 18.3369 6.80257 18.2632 6.72893C16.091 4.56189 13.9219 2.39201 11.7533 0.221298C11.6866 0.154587 11.6339 0.0740662 11.5746 0H11.5216Z'
										fill={
											!redoStack.length
												? "#D5AA6D"
												: "white"
										}
									/>
								</svg>
							</Button>
							<span className='mt-1 text-sm'>Redo</span>
						</div>
					</div>
				</div>

				{/* Upload Image Box */}
				{loading ? (
					<Skeleton
						width='550px'
						height='400px'
						className='border-round-3xl mx-auto mb-5'
					></Skeleton>
				) : (
					<div
						className='justify-content-center relative flex cursor-pointer'
						onClick={handleImageClick}
					>
						<img src={maskData?.imageUrl} alt='Uploaded' className='' />
						{selectedMaskUrls.map((url, idx) => (
							<img
								key={idx}
								src={url}
								alt='mask'
								className='mask-overlay justify-content-center absolute flex'
							/>
						))}
					</div>
				)}

				{/* Next Button */}
				<div className='mb-2 mt-4 text-left'>
					<Button
						label='Next'
						className='bg-orange rounded-full border-none px-5 py-3 text-white'
						disabled={!selectedMaskUrls.length}
						onClick={() => router.push("/dashboard/garden-styles")}
					/>
				</div>
			</div>
		</div>
	);
};

export default AutoMask;
