"use client";
import { SubscriptionDialogProps } from "@/types/automask-delete-dialog";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const SubscriptionDialog = ({
	showUpgradeModal,
	setShowUpgradeModal,
}: SubscriptionDialogProps) => {
	const router = useRouter();
	return (
		<div>
			<Dialog
				header='Upgrade Required'
				visible={showUpgradeModal}
				style={{ width: "50vw" }}
				onHide={() => {
					if (!showUpgradeModal) return;
					setShowUpgradeModal(false);
				}}
				closable={false}
				modal
			>
				<p>
					You’ve reached your image generation limit. Please upgrade
					your plan to continue.
				</p>
				<div className='justify-content-end mt-4 flex gap-2'>
					<Button
						label='Cancel'
						icon='pi pi-times'
						onClick={() => setShowUpgradeModal(false)}
						className='p-button-text'
						style={{ color: "#ffa530" }}
					/>
					<Button
						label='Upgrade Plan'
						icon='pi pi-arrow-right'
						onClick={() => {
							setShowUpgradeModal(false);
							router.push("/dashboard/subscription");
						}}
						style={{
							backgroundColor: "#ffa530",
							borderColor: "#ffa530",
							color: "white",
							borderRadius: "8px",
							padding: "0.8rem",
						}}
						autoFocus
					/>
				</div>
			</Dialog>
		</div>
	);
};

export default SubscriptionDialog;
