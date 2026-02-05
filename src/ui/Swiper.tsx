"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Skeleton } from "primereact/skeleton";
import { Card } from "primereact/card";
import { Image } from "primereact/image";

import { SwipersProps } from "@/types/AiImages";
import { markFavorites } from "@/services/favorites";
import { useSwiperKeyboard } from "@/hooks/useSwiperKeyboard";
import "./index.css";

const SKELETON_COUNT = 3;
const NAVIGATION_DELAY = 100;
const UPDATE_NAVIGATION_DELAY = 300;
const DEFAULT_SLIDE_WIDTH = "60%";
const PLACEHOLDER_IMAGE =
	"https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";

export default function Swipers({
	images,
	loading,
	pollImages,
	styleName,
}: SwipersProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
		null,
	);
	const [localImages, setLocalImages] = useState(images);

	const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

	const { previewButtonsRef } = useSwiperKeyboard(
		swiperInstance,
		activeIndex,
	);

	const handleSlideChange = useCallback((swiper: SwiperType) => {
		setActiveIndex(swiper.realIndex);
	}, []);

	const handleSwiper = useCallback((swiper: SwiperType) => {
		setSwiperInstance(swiper);

		setTimeout(() => {
			swiper.navigation?.init();
			swiper.navigation?.update();
		}, NAVIGATION_DELAY);
	}, []);

	useEffect(() => {
		if (!swiperInstance) return;

		const slides = swiperInstance.slides;
		slides?.forEach((slide, index) => {
			slide.classList.toggle("my-slide-active", index === activeIndex);
		});
	}, [activeIndex, swiperInstance]);

	useEffect(() => {
		if (!swiperInstance) return;

		const updateNavigation = () => {
			setTimeout(() => {
				swiperInstance.navigation?.init();
				swiperInstance.navigation?.update();
			}, UPDATE_NAVIGATION_DELAY);
		};

		const events = ["init", "slideChange", "resize"] as const;
		events.forEach((event) => swiperInstance.on(event, updateNavigation));

		return () => {
			events.forEach((event) =>
				swiperInstance.off(event, updateNavigation),
			);
		};
	}, [swiperInstance]);

	useEffect(() => {
		setLocalImages(images);
		imageRefs.current = imageRefs.current.slice(0, images.length);
		previewButtonsRef.current = previewButtonsRef.current.slice(
			0,
			images.length,
		);
	}, [images, previewButtonsRef]);

	const handleFavoriteToggle = useCallback(
		async (uuid: string, currentFavorite: boolean) => {
			try {
				setLocalImages((prev) =>
					prev.map((img) =>
						img.uuid === uuid
							? { ...img, favorite: !currentFavorite }
							: img,
					),
				);
				await markFavorites(uuid, !currentFavorite);
				await pollImages();
			} catch (error) {
				console.error("Error toggling favorite:", error);
				setLocalImages((prev) =>
					prev.map((img) =>
						img.uuid === uuid
							? { ...img, favorite: currentFavorite }
							: img,
					),
				);
			}
		},
		[pollImages],
	);

	const createCardHeader = useCallback(
		(style: { id: number; imageUrl: string }, index: number) => {
			const handleImageError = (
				e: React.SyntheticEvent<HTMLImageElement>,
			) => {
				e.currentTarget.src = PLACEHOLDER_IMAGE;
			};

			return (
				<div
					className='p-image relative w-full overflow-hidden'
					ref={(el) => {
						imageRefs.current[index] = el;
					}}
				>
					<Image
						alt={`${style.id} Garden Style`}
						src={style.imageUrl || "/placeholder.svg"}
						onError={handleImageError}
						className='garden-image h-64 w-full cursor-pointer object-cover'
						preview
						onShow={() => {
							const button = document.querySelector(
								".p-image-preview-indicator",
							) as HTMLButtonElement | null;
							previewButtonsRef.current[index] = button;
						}}
					/>
				</div>
			);
		},
		[previewButtonsRef],
	);

	const renderSkeletons = useMemo(
		() =>
			Array.from({ length: SKELETON_COUNT }, (_, index) => (
				<div className='flex flex-row p-4' key={`skeleton-${index}`}>
					<Skeleton
						width='300px'
						height='300px'
						className='border-round-3xl mx-auto mb-5'
					/>
				</div>
			)),
		[],
	);

	const renderImages = useMemo(
		() =>
			localImages.map((style, index) => {
				const isActive = activeIndex === index;

				return (
					<SwiperSlide
						key={style.id}
						className={isActive ? "my-slide-active" : ""}
						style={{
							width: DEFAULT_SLIDE_WIDTH,
							opacity: isActive ? 1 : 0.7,
							filter: isActive ? "none" : "blur(1px)",
							transform: isActive ? "scale(1.1)" : "scale(0.9)",
							zIndex: isActive ? 2 : 1,
						}}
					>
						<Card
							className='garden-card h-full cursor-pointer'
							header={createCardHeader(style, index)}
							style={{ margin: 0, border: "none" }}
							footer={
								<div className='mb-2 text-start text-sm font-semibold text-gray-700'>
									{styleName &&
										styleName.charAt(0).toUpperCase() +
											styleName.slice(1)}
								</div>
							}
						>
							<i
								className={`pi ${
									style.favorite
										? "pi-heart-fill"
										: "pi-heart"
								} heart-icon mr-2 rounded-full p-2 shadow-md`}
								onClick={(e) => {
									e.stopPropagation();
									handleFavoriteToggle(
										style.uuid,
										style.favorite,
									);
								}}
								role='button'
								tabIndex={0}
								aria-label={
									style.favorite
										? "Remove from favorites"
										: "Add to favorites"
								}
							/>
						</Card>
					</SwiperSlide>
				);
			}),
		[
			localImages,
			activeIndex,
			styleName,
			createCardHeader,
			handleFavoriteToggle,
		],
	);

	const swiperConfig = useMemo(
		() => ({
			slidesPerView: "auto" as const,
			centeredSlides: true,
			initialSlide: 1,
			coverflowEffect: {
				rotate: 0,
				stretch: 0,
				depth: 100,
				modifier: 2.5,
				slideShadows: false,
			},
			grabCursor: true,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			pagination: {
				clickable: true,
				el: ".swiper-pagination",
			},
			modules: [Navigation, Pagination, EffectCoverflow],
			onSlideChange: handleSlideChange,
			onSwiper: handleSwiper,
			observer: true,
			observeParents: true,
			resizeObserver: true,
		}),
		[handleSlideChange, handleSwiper],
	);

	if (loading) {
		return <>{renderSkeletons}</>;
	}

	return (
		<div className='full-width-container'>
			<div className='swiper-container-wrapper'>
				<Swiper {...swiperConfig} className='full-width-swiper'>
					{renderImages}
					<div className='swiper-button-next' />
					<div className='swiper-button-prev' />
					<div className='swiper-pagination' />
				</Swiper>
			</div>
		</div>
	);
}
