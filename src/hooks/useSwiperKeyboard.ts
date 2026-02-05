import { useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { createSwiperKeyboardHandler } from "@/utils/swiperKeyboard";

export const useSwiperKeyboard = (
	swiperInstance: SwiperType | null,
	activeIndex: number,
) => {
	const previewButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		const handleKeyDown = createSwiperKeyboardHandler({
			swiperInstance,
			activeIndex,
			previewButtonsRef,
		});

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [swiperInstance, activeIndex]);

	return { previewButtonsRef };
};
