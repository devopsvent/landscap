"use client";
import { useEffect, useState } from "react";
import type { ShareDialogProps } from "@/types/automask-ideas";
import CloseIcon from "./CloseIcon";
import "./ShareDialog.css";
import { Image } from "primereact/image";
import toast from "react-hot-toast";

const ShareDialog = ({
	overlayVisible,
	setOverlayVisible,
	showBottomSheet,
	setShowBottomSheet,
	images,
	preselectedIndices,
}: ShareDialogProps) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number[]>([]);
	const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

	const closeBottomSheet = () => {
		setShowBottomSheet(false);
		setOverlayVisible(false);
	};

	useEffect(() => {
		if (preselectedIndices && preselectedIndices.length > 0) {
			setSelectedImageIndex(preselectedIndices);
			const urls = preselectedIndices.map((i) => images[i].imageUrl);
			setSelectedImageUrls(urls);
		}
	}, [preselectedIndices, images]);

	const handleCardSelect = (index: number) => {
		const imageUrl = images[index].imageUrl;

		if (selectedImageIndex.includes(index)) {
			setSelectedImageIndex((prev) => prev.filter((i) => i !== index));
			setSelectedImageUrls((prev) =>
				prev.filter((url) => url !== imageUrl),
			);
		} else {
			setSelectedImageIndex((prev) => [...prev, index]);
			setSelectedImageUrls((prev) => [...prev, imageUrl]);
		}
	};

	const handleDownloadImages = async () => {
		for (let i = 0; i < selectedImageUrls.length; i++) {
			const url = selectedImageUrls[i];
			const response = await fetch(url);
			const blob = await response.blob();
			const blobUrl = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `image-${i + 1}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			await new Promise((resolve) => setTimeout(resolve, 200));
		}
	};

	const handleCopyImageUrls = () => {
		const message = selectedImageUrls.join("\n");
		navigator.clipboard
			.writeText(message)
			.then(() => {
				toast.success("copied to clipboard!");
			})
			.catch((error) => {
				toast.error("Failed to copy: " + error.message);
			});
	};

	const handleShareWhatsApp = () => {
		const message = selectedImageUrls.join("\n");
		const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};

	const handleShareFacebook = () => {
		const urlToShare = selectedImageUrls[0]; // OR create your own landing page
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`;
		window.open(facebookUrl, "_blank");
	};

	return (
		<>
			{/* Bottom Sheet Overlay */}
			{overlayVisible && (
				<div
					className='bottom-sheet-overlay'
					onClick={closeBottomSheet}
				></div>
			)}

			{/* Bottom Sheet Form */}
			<div className={`bottom-sheet ${showBottomSheet ? "show" : ""}`}>
				{/* First row: Share title and close button */}
				<button className='close-button' onClick={closeBottomSheet}>
					<CloseIcon />
				</button>
				<div className='bottom-sheet-header mt-8 border-none'>
					{" "}
					<div className='sheet-header-row'>
						<div className='icon-and-text'>
							{/* Green Share Icon */}
							<div className='share-icon-wrapper'>
								<i
									className='pi pi-share-alt'
									style={{ color: "#fff", fontSize: "18px" }}
								/>
							</div>

							{/* Text content */}
							<div>
								<div className='share-title'>Share with</div>
								<div className='share-subtitle'>
									{selectedImageIndex.length} image
									{selectedImageIndex.length !== 1
										? "s"
										: ""}{" "}
									selected
								</div>
							</div>
						</div>
					</div>
					{/* Second row: Social icons */}
					<div className='social-icons-container justify-content-end'>
						<div
							className='social-icon'
							style={{ backgroundColor: "#E06D6F" }}
							onClick={handleCopyImageUrls}
						>
							<i className='pi pi-copy' />
						</div>
						<div
							className='social-icon'
							style={{ backgroundColor: "#004626" }}
							onClick={handleDownloadImages}
						>
							<i className='pi pi-arrow-circle-down' />
						</div>
						<div
							className='social-icon'
							style={{ backgroundColor: "#25D366" }}
							onClick={handleShareWhatsApp}
						>
							<i className='pi pi-whatsapp' />
						</div>
						<div
							className='social-icon'
							style={{ backgroundColor: "#1877F2" }}
							onClick={handleShareFacebook}
						>
							<i className='pi pi-facebook' />
						</div>
					</div>
				</div>

				{/* Grid layout for images */}
				<div className='p-4'>
					{images.length === 1 ? (
						<div className='justify-content-center align-items-center flex h-auto'>
							<img
								src={images[0].imageUrl}
								alt='Shared'
								className='preview-image'
							/>
						</div>
					) : (
						<div className='image-grid'>
							{images.map((item, id) => (
								<div
									key={id}
									className={`image-container ${selectedImageIndex.includes(id) ? "selected" : ""}`}
									onClick={() => handleCardSelect(id)}
								>
									<Image
										src={
											item.imageUrl || "/placeholder.svg"
										}
										alt={`img-${id}`}
										className='gallery-image'
										width='100%'
										height='auto'
									/>

									{/* Centered check icon for selected image */}
									{selectedImageIndex.includes(id) && (
										<div className='selection-indicator'>
											<i className='pi pi-check' />
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ShareDialog;
