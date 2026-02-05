export interface CreateMaskProps {
	imageUrl: string;
}

export interface FetchMaskProps {
	maskingUuid: string;
}

export interface Mask {
	area: number;
	bbox: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	mask_url: string;
	segment_id: number;
	center_point: {
		x: number;
		y: number;
	};
	predicted_iou: number;
	stability_score: number;
}

export interface MaskProps {
	imageUrl: string;
	job_id: string;
	status: string;
	masks: Mask[];
}
