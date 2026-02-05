import type { Swiper as SwiperType } from "swiper";

interface SwiperKeyboardConfig {
	swiperInstance: SwiperType | null;
	activeIndex: number;
	previewButtonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export const createSwiperKeyboardHandler = ({
	swiperInstance,
	activeIndex,
	previewButtonsRef,
}: SwiperKeyboardConfig) => {
	return (e: KeyboardEvent) => {
		if (!swiperInstance) return;

		switch (e.key) {
			case "ArrowLeft":
				swiperInstance.slidePrev();
				break;
			case "ArrowRight":
				swiperInstance.slideNext();
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				const activePreviewButton =
					previewButtonsRef.current[activeIndex];
				activePreviewButton?.click();
				break;
			default:
				break;
		}
	};
};

export const handleSwiperKeyDown = (
	e: KeyboardEvent,
	swiperInstance: SwiperType | null,
	activeIndex: number,
	previewButtonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>,
) => {
	if (!swiperInstance) return;

	switch (e.key) {
		case "ArrowLeft":
			swiperInstance.slidePrev();
			break;
		case "ArrowRight":
			swiperInstance.slideNext();
			break;
		case "Enter":
		case " ":
			e.preventDefault();
			const activePreviewButton = previewButtonsRef.current[activeIndex];
			activePreviewButton?.click();
			break;
		default:
			break;
	}
};
