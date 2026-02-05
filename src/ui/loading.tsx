export default function Loading() {
	return (
		<div className='justify-content-center align-items-center flex h-screen'>
			<div className='text-center'>
				<i
					className='pi pi-spin pi-spinner'
					style={{ fontSize: "2rem" }}
				></i>
				<p>Loading...</p>
			</div>
		</div>
	);
}
