import logo from "@/assets/landscape_logo.png";
import Image from "next/image";
const Logo = () => {
	return (
		<div
			className='w-6rem h-6rem border-round-2xl align-items-center justify-content-center mb-6 flex'
			style={{ backgroundColor: "#D9CD82" }}
		>
			<Image src={logo} alt='Logo' className='w-5rem h-5rem' />
		</div>
	);
};

export default Logo;
