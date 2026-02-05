import { InputText } from "primereact/inputtext";
import "../index.css";

const Searchbar = () => {
	return (
		<div className='searchbar-container mb-5'>
			<span className='p-input-icon-left border-radius-2xl w-full'>
				<InputText
					placeholder='Search...'
					className='p-inputtext-rounded searchbar-input ml-3'
				/>
			</span>
		</div>
	);
};

export default Searchbar;
