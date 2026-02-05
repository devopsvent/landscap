"use client";
import { AddressbarProps } from "@/types/dashboard";
import "../index.css";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const Addressbar: React.FC<AddressbarProps> = ({ setAddress }) => {
	return (
		<div className='mb-6'>
			<label className='text-md mb-3 block font-medium text-gray-700'>
				Use An Address
			</label>
			<GooglePlacesAutocomplete
				debounce={800}
				// apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
				apiOptions={{
					libraries: ["places"],
				}}
				selectProps={{
					loadingMessage: () => "Loading...",
					placeholder: "To pull photo from street view",
					onChange: (value) => {
						setAddress(value?.label || "");
					},
					styles: {
						control: (provided, state) => ({
							...provided,
							borderRadius: "25px",
							border: "1px solid #bbb",
							borderColor: state.isFocused ? "#ffa530" : "#ccc",
							boxShadow: "none", // Default: no shadow
							padding: "5px",
							outline: "none",
							"&:hover": {
								borderColor: "#ffa530",
								boxShadow:
									"0 0 0 0.2rem rgba(255, 165, 48, 0.3)", // Only on hover
							},
						}),
						input: (provided) => ({
							...provided,
							color: "black",
							fontSize: "16px",
						}),
						option: (provided) => ({
							...provided,
							color: "black",
						}),
					},
				}}
			/>
		</div>
	);
};

export default Addressbar;
