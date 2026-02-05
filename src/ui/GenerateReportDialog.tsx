"use client";
import { GenerateReportDialogProps } from "@/types/automask-delete-dialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const GenerateReportDialog = ({
	showGenerateReport,
	setShowGenerateReport,
	report,
}: GenerateReportDialogProps) => {
	return (
		<div>
			<Dialog
				header='Landscape Design Report'
				visible={showGenerateReport}
				style={{ width: "50vw", height: "auto", overflow: "auto" }}
				onHide={() => {
					if (!showGenerateReport) return;
					setShowGenerateReport(false);
				}}
				closable={false}
				modal
			>
				<div className='flex-column flex gap-4 p-4 leading-6 text-gray-800'>
					{/* Landscape Theme */}
					<div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='mb-2 flex items-center gap-2'>
							<i className='pi pi-palette text-green-600'></i>
							<strong className='text-lg text-gray-900'>
								Landscape Theme Selected
							</strong>
						</div>
						<p className='text-gray-700'>
							The chosen design style for this landscape is{" "}
							<span className='font-semibold text-green-700'>
								{report?.selectedStyle}
							</span>
							, which reflects the desired visual mood and
							aesthetic direction.
						</p>
					</div>

					{/* USDA Zone */}
					<div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='mb-2 flex items-center gap-2'>
							<i className='pi pi-map-marker text-blue-600'></i>
							<strong className='text-lg text-gray-900'>
								USDA Zone
							</strong>
						</div>
						<p className='text-gray-700'>
							This garden design is based on USDA Zone{" "}
							<span className='font-semibold text-blue-700'>
								{report?.zoneCode}
							</span>
							. This ensures that plant selections are
							climate-appropriate and can thrive in this
							region&apos;s temperature and seasonal patterns.
						</p>
					</div>

					{/* Recommended Plants */}
					<div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='mb-3 flex items-center gap-2'>
							<i className='pi pi-lightbulb text-purple-600'></i>
							<strong className='text-lg text-gray-900'>
								Recommended Plant Selections
							</strong>
						</div>
						<p className='mb-3 text-gray-700'>
							Below is the curated list of plants selected to
							match your climate zone and theme:
						</p>
						<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
							{report?.plants?.map((plant, index) => (
								<div
									key={index}
									className='flex-column flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3'
								>
									<div className='h-2 w-2 rounded-full bg-green-500'></div>
									<span className='font-semibold capitalize text-gray-800'>
										{index + 1}. {plant}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='justify-content-end mt-6 flex gap-2 border-t border-gray-200 p-4'>
					<Button
						label='Close Report'
						icon='pi pi-times'
						onClick={() => setShowGenerateReport(false)}
						className='p-button-text'
						style={{ color: "#ffa530" }}
					/>
				</div>
			</Dialog>
		</div>
	);
};

export default GenerateReportDialog;
