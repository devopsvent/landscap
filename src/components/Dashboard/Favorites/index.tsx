"use client";
import { Card } from "primereact/card";
import "./index.css";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import type { FavoriteItem } from "@/types/favorites";
import { getFavorites, markFavorites } from "@/services/favorites";
import toast from "react-hot-toast";
import { Skeleton } from "primereact/skeleton";
import { isAxiosError } from "axios";
import ShareDialog from "@/ui/ShareDialog";
import "@/app/globals.css";
import { Dialog } from "primereact/dialog";

const Favorites = () => {
	const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
	const [selectedImage, setSelectedImage] = useState<FavoriteItem | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogImage, setDialogImage] = useState("");

	const fetchFavorites = async () => {
		try {
			setLoading(true);
			const response = await getFavorites();
			setFavoriteItems(response.data || []);
		} catch (error) {
			const message = isAxiosError(error)
				? error.response?.data?.message || "Error fetching favorites"
				: "An unexpected error occurred";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFavorites();
	}, []);

	const handleFavoriteToggle = async (
		uuid: string,
		currentFavorite: boolean,
	) => {
		if (currentFavorite) {
			// Hide item immediately if unfavoriting
			setFavoriteItems((prevItems) =>
				prevItems.filter((item) => item.uuid !== uuid),
			);
		} else {
			// If favoriting, update UI locally
			setFavoriteItems((prevItems) =>
				prevItems.map((item) =>
					item.uuid === uuid ? { ...item, favorite: true } : item,
				),
			);
		}

		try {
			await markFavorites(uuid, !currentFavorite);
		} catch (error) {
			// Revert UI on failure
			if (currentFavorite) {
				const itemToRestore = favoriteItems.find(
					(item) => item.uuid === uuid,
				);
				if (itemToRestore) {
					setFavoriteItems((prevItems) => [
						...prevItems,
						itemToRestore,
					]);
				}
			} else {
				// If favorite failed, revert back
				setFavoriteItems((prevItems) =>
					prevItems.map((item) =>
						item.uuid === uuid
							? { ...item, favorite: false }
							: item,
					),
				);
			}
			const message = isAxiosError(error)
				? error.response?.data?.message || "Error updating favorite"
				: "An unexpected error occurred";
			toast.error(message);
		}
	};

	const handleSelectShareSession = (id: number) => {
		const selected = favoriteItems.find((item) => item.id === id) || null;
		setSelectedImage(selected);
		setShowBottomSheet(true);
		setOverlayVisible(true);
	};

	const createCardHeader = (style: FavoriteItem) => {
		return (
			<div className='garden2-image-wrapper'>
				<Image
					alt={`${style.id} favorite Image`}
					src={style.imageUrl || "/placeholder.svg"}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							"https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
					}}
					className='garden2-image-favorite'
					onClick={() => {
						setDialogImage(style.imageUrl);
						setVisible(true);
					}}
				/>
				<div className='icon-overlay'>
					<i
						className={`pi ${style.favorite ? "pi-heart-fill" : "pi-heart"}`}
						onClick={async (e) => {
							e.stopPropagation();
							handleFavoriteToggle(style.uuid, style.favorite);
						}}
						style={{ fontSize: "1.5rem", color: "#ffa530" }}
					/>
					<i
						className='pi pi-share-alt'
						style={{ fontSize: "1.5rem", color: "white" }}
						onClick={() => handleSelectShareSession(style.id)}
					/>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className='custom-border justify-content-between align-items-center ml-1 flex flex-shrink-0 px-2'>
				<h2 className='mb-4 text-2xl font-semibold'>Favorites</h2>
			</div>
			<div className='my-2 grid'>
				{loading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='col-12 md:col-6 lg:col-4 p-2'>
							<Card className='garden2-card-favorite'>
								<div className='mb-3'>
									<Skeleton
										height='200px'
										className='w-full'
									/>
								</div>
							</Card>
						</div>
					))
				) : favoriteItems.length > 0 ? (
					favoriteItems.map((style) => (
						<div
							key={style.id}
							className='col-12 md:col-6 lg:col-4 p-2'
						>
							<Card
								className='garden2-card-favorite cursor-pointer'
								header={createCardHeader(style)}
								style={{ margin: 0, border: "none" }}
							/>
						</div>
					))
				) : (
					<div className='col-12 justify-content-center align-items-center flex py-20'>
						<div className='text-center'>
							<i className='pi pi-heart mb-4 text-4xl text-gray-400'></i>
							<h3 className='text-lg font-semibold text-gray-600'>
								No favorites yet
							</h3>
							<p className='text-sm text-gray-500'>
								You can favorite items to see them here.
							</p>
						</div>
					</div>
				)}
			</div>
			{selectedImage && (
				<ShareDialog
					overlayVisible={overlayVisible}
					setOverlayVisible={setOverlayVisible}
					showBottomSheet={showBottomSheet}
					setShowBottomSheet={setShowBottomSheet}
					images={selectedImage ? [selectedImage] : []}
					preselectedIndices={[0]}
				/>
			)}
			<Dialog
				visible={visible}
				style={{ width: "vw" }}
				onHide={() => setVisible(false)}
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				dismissableMask
				blockScroll
				modal
				closable={false}
				showHeader={false}
				className='custom-dialog-fav'
			>
				<Image
					src={dialogImage}
					alt='Preview'
					className='border-round-3xl h-auto w-full object-contain'
				/>
			</Dialog>
		</div>
	);
};

export default Favorites;
