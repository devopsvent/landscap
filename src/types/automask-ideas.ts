import { GeneratedImage } from "./AiImages";

export interface ShareDialogProps {
	overlayVisible: boolean;
	setOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
	showBottomSheet: boolean;
	setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
	images: GeneratedImage[];
	preselectedIndices?: number[];
}
