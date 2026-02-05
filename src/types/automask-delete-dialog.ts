export interface DeleteDialogProps {
	overlayDeleteVisible: boolean;
	setOverlayDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>;
	showDeleteBottomSheet: boolean;
	setShowDeleteBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
	loading: boolean;
	handleDeleteSession: () => void;
}

export interface SubscriptionDialogProps {
	showUpgradeModal: boolean;
	setShowUpgradeModal: React.Dispatch<React.SetStateAction<boolean>>;
	loading?: boolean;
}

export interface ReportData {
	selectedStyle: string;
	zoneCode: string;
	plants: string[];
}

export interface GenerateReportDialogProps {
	showGenerateReport: boolean;
	setShowGenerateReport: React.Dispatch<React.SetStateAction<boolean>>;
	loading?: boolean;
	report?: ReportData; // <<< change here
}
