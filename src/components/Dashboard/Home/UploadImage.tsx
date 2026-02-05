import { UploadImageProps } from "@/types/Upload";

const UploadImage: React.FC<UploadImageProps> = ({
	handleClick,
	handleFileChange,
	fileName,
	fileInputRef,
}) => {
	return (
		<div className='mb-6'>
			<label className='text-md mb-3 block font-medium text-gray-700'>
				Upload Image
			</label>

			<div
				className='upload-box cursor-pointer rounded-[30px] border border-gray-200 bg-white text-center shadow-sm'
				onClick={handleClick}
			>
				<div className='flex-column align-items-center justify-content-center flex text-gray-500'>
					<>
						<i className='pi pi-image upload-icon my-auto text-5xl' />
						<p className='upload-text my-auto text-lg font-medium'>
							{fileName || "Upload Image"}
						</p>
					</>
				</div>
			</div>

			{/* Hidden File Input */}
			<input
				type='file'
				accept='image/*'
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: "none" }}
			/>
		</div>
	);
};

export default UploadImage;
