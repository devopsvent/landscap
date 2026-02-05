"use client";
import CloseIcon from "./CloseIcon";
import "./index.css";
import "../components/Dashboard/GenerateImages/index.css";
import { DeleteDialogProps } from "@/types/automask-delete-dialog";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { Button } from "primereact/button";

const CancelSubscriptionDialog = ({
	overlayDeleteVisible,
	setOverlayDeleteVisible,
	showDeleteBottomSheet,
	setShowDeleteBottomSheet,
	handleDeleteSession,
	loading,
}: DeleteDialogProps) => {
	const closeBottomSheet = () => {
		setShowDeleteBottomSheet(false);
		setOverlayDeleteVisible(false);
	};

	return (
		<>
			{/* Bottom Sheet Overlay */}
			{overlayDeleteVisible && (
				<div
					className='bottom-sheet-overlay'
					onClick={closeBottomSheet}
				></div>
			)}

			{/* Bottom Sheet Form */}
			<div
				className={`bottom-sheet ${showDeleteBottomSheet ? "show" : ""}`}
			>
				{/* First row: Share title and close button */}
				<button className='close-button' onClick={closeBottomSheet}>
					<CloseIcon />
				</button>
				<div className='bottom-sheet-header border-none'>
					<div className='flex-column flex'>
						<p className='text-xl font-semibold'>
							Are you sure? You want to Cancel your subscription
						</p>
						<p className='mt-2 text-base font-medium'>
							This will cancel your subscription and you will not
							be charged for the next billing cycle. You will
							still have access to your current plan until the end
							of the billing period.
						</p>
					</div>
				</div>

				<Button
					label='Proceed'
					className='bg-orange mx-4 rounded-full border-none px-5 py-3 text-white'
					onClick={handleDeleteSession}
					icon={loading ? "pi pi-spin pi-spinner" : ""}
					disabled={loading}
				/>
			</div>
		</>
	);
};

export default CancelSubscriptionDialog;
