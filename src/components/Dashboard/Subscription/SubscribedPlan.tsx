"use client";
import { Card } from "primereact/card";
import "./SubscribedPlan.css";
import { useRouter } from "next/navigation";
import { SubscribedPlanProps } from "@/types/Subscription";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import CancelSubscriptionDialog from "@/ui/CancelSubscriptionDialog";

const SubscribedPlan = ({
	planName,
	price,
	onCancel,
	planType,
	status,
}: SubscribedPlanProps) => {
	const router = useRouter();
	const [canceling, setCanceling] = useState(false);
	const [showDeleteBottomSheet, setShowDeleteBottomSheet] = useState(false);
	const [overlayDeleteVisible, setOverlayDeleteVisible] = useState(false);
	const handleUpgrade = () => {
		router.push("/dashboard/subscription/change-plan");
	};
	const handleCancel = () => {
		setCanceling(true);
		onCancel();
	};
	useEffect(() => {
		if (status === "CANCELED") {
			setCanceling(false);
			setShowDeleteBottomSheet(false);
			setOverlayDeleteVisible(false);
		}
	}, [status]);
	return (
		<div className='subscription-container'>
			<div className='custom-border justify-content-between align-items-center flex flex-shrink-0 px-2'>
				<h2 className='mb-4 text-2xl font-semibold'>Plan Details</h2>
			</div>

			<div className='subscription-cards'>
				<Card className='subscription-card'>
					<div className='plan-headers'>
						<div className='plan-descriptions'>
							<h2 className='font-semibold'>
								Subscription Plan Details
							</h2>
							<div className='grid'>
								<div
									className='col-5'
									style={{ textAlign: "left" }}
								>
									<div className='flex-column my-2 flex gap-2'>
										<span>Subscription</span>
										<span>Price</span>
										<span>Plan Type</span>
										<span>Plan Status</span>
									</div>
								</div>
								<div className='col-6'>
									<div className='flex-column my-2 flex gap-2'>
										<strong>{planName}</strong>
										<strong>{price}</strong>
										<strong>{planType}</strong>
										<strong>{status}</strong>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='subscription-actions'>
						<Button
							className='subscribe-button'
							onClick={handleUpgrade}
							label='Upgrade Subscription Plan'
						/>
					</div>
				</Card>
			</div>
			<CancelSubscriptionDialog
				overlayDeleteVisible={overlayDeleteVisible}
				setOverlayDeleteVisible={setOverlayDeleteVisible}
				showDeleteBottomSheet={showDeleteBottomSheet}
				setShowDeleteBottomSheet={setShowDeleteBottomSheet}
				handleDeleteSession={handleCancel}
				loading={canceling}
			/>
		</div>
	);
};

export default SubscribedPlan;
