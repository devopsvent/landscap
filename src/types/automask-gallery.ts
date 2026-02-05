export interface YardTypes {
	label: string;
	value: number;
}

export interface BottomSheetProps {
	overlayVisible: boolean;
	setOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
	showBottomSheet: boolean;
	setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
	yardTypes: YardTypes[];
	yardType: number | null;
	setYardType: (value: number | null) => void;
	yardOnASlope: boolean;
	setYardOnASlope: React.Dispatch<React.SetStateAction<boolean>>;
}
