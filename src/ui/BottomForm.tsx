import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { BottomSheetProps } from "@/types/automask-gallery";
import CloseIcon from "./CloseIcon";

const BottomForm = ({
	overlayVisible,
	setOverlayVisible,
	showBottomSheet,
	setShowBottomSheet,
	yardTypes,
	yardType,
	setYardType,
	yardOnASlope,
	setYardOnASlope,
}: BottomSheetProps) => {
	const sunlightOptions = [
		{ label: "Full sun (6+ hours)", value: "full" },
		{ label: "Partial sun (4-6 hours)", value: "partial" },
		{ label: "Shade (less than 4 hours)", value: "shade" },
	];
	const [sunlight, setSunlight] = useState(null);
	const closeBottomSheet = () => {
		setShowBottomSheet(false);
		setOverlayVisible(false);
	};
	return (
		<>
			{/* Bottom Sheet Overlay */}
			{overlayVisible && (
				<div
					className='bottom-sheet-overlay'
					onClick={closeBottomSheet}
				></div>
			)}

			{/* Bottom Sheet Form */}
			<div className={`bottom-sheet ${showBottomSheet ? "show" : ""}`}>
				<div className='bottom-sheet-header'>
					<h3 className='text-xl font-medium'>
						Additional information
					</h3>
					<button
						className='close-button absolute right-0 top-0'
						onClick={closeBottomSheet}
					>
						<CloseIcon />
					</button>
				</div>
				<div className='bottom-sheet-content'>
					<div className='formgrid p-fluid grid'>
						<div className='field col-6 mb-4'>
							<label
								htmlFor='yardType'
								className='mb-2 block text-sm font-medium'
							>
								Yard type
							</label>
							<Dropdown
								id='yardType'
								value={yardType}
								options={yardTypes}
								onChange={(e) => setYardType(e.value)}
								placeholder='Back Yard'
								className='border-round-3xl w-full p-2'
							/>
						</div>

						<div className='field col-6 mb-4'>
							<label
								htmlFor='sunlight'
								className='mb-2 block text-sm font-medium'
							>
								Sunlight Exposure
							</label>
							<Dropdown
								id='sunlight'
								value={sunlight}
								options={sunlightOptions}
								onChange={(e) => setSunlight(e.value)}
								placeholder='Full sun (6+ hours)'
								className='border-round-3xl w-full p-2'
							/>
						</div>

						<div className='field-checkbox col-12 mb-4'>
							<div className='align-items-center flex'>
								<Checkbox
									inputId='slope'
									checked={yardOnASlope}
									onChange={(e) =>
										setYardOnASlope(e.checked ?? false)
									}
									style={{ color: "orange" }}
								/>
								<label htmlFor='slope' className='ml-2'>
									My yard is on a slope
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className='bottom-sheet-footer'>
					<Button
						label='Save'
						className='bg-orange rounded-full border-none px-5 py-3 text-white'
						onClick={closeBottomSheet}
					/>
				</div>
			</div>
		</>
	);
};

export default BottomForm;
