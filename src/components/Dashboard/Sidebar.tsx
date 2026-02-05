"use client";
import React from "react";
import { FaHome, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { SidebarProps } from "@/types/Sidebar";
import Logo from "@/ui/Logo";
import "./index.css";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useImage } from "@/context/ImageContext";

const Sidebar: React.FC<SidebarProps> = ({ onLogout, loggingOut }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { setSelectedImage, setSelectedMaskUrls, setSelectedStyleId } =
		useImage();
	const menuItems = [
		{
			icon: <FaHome />,
			label: "Home",
			path: [
				"/dashboard",
				"/dashboard/automask",
				"/dashboard/garden-styles",
				"/dashboard/generate-images",
			],
		},
		{
			icon: <FaHeart />,
			label: "Favorites",
			path: ["/dashboard/favorites"],
		},
		{
			icon: <MdSubscriptions />,
			label: "Subscription",
			path: [
				"/dashboard/subscription",
				"/dashboard/subscription/change-plan",
			],
		},
		// {
		// 	icon: <FaHeadphones />,
		// 	label: "Help Center",
		// 	path: ["/dashboard/help"],
		// },
	];

	return (
		<div className='flex-column justify-content-between w-18rem border-round-right-3xl dash-sidebar-container flex p-3'>
			<div className='top-wave'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='300'
					height='160'
					viewBox='0 0 300 206'
					fill='none'
				>
					<path
						d='M0.882996 0.696136C0.882996 0.696136 88.5926 -0.477768 91.145 71.9396C93.6973 144.357 174.515 131.043 174.515 131.043C174.515 131.043 256.029 115.861 247.721 201.798C248.372 210.436 250.252 202.095 251.848 201.798C257.848 201.772 335.28 71.9396 335.28 71.9396L297.401 -71.7213L0.882996 -3.82057V0.696136Z'
						fill='#F8FFFC'
					/>
				</svg>
			</div>
			{/* Logo and theme icon */}
			<div className='mt-1'>
				<Logo />

				{/* Menu items */}
				<ul className='m-0 list-none p-0'>
					{menuItems.map(({ icon, label, path }) => (
						<li
							key={label}
							onClick={() => {
								if (path[0] === "/dashboard") {
									setSelectedImage("");
									setSelectedStyleId(null);
									setSelectedMaskUrls([]);
								}
								router.push(path[0]);
							}}
							className={`align-items-center transition-duration-200 mb-2 flex cursor-pointer gap-3 p-3 transition-colors ${
								path.includes(pathname)
									? "bg-orange1 text-white"
									: "text-white hover:bg-orange-200"
							}`}
						>
							<span className='text-lg'>{icon}</span>
							<span className='font-medium'>{label}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Logout button */}
			<Button
				className='align-items-center logout-button transition-color flex cursor-pointer gap-2 p-3 text-white'
				disabled={loggingOut}
				onClick={onLogout}
			>
				<FaSignOutAlt className='text-orange-400' />
				<span>{loggingOut ? "Logging Out" : "LOGOUT"}</span>
			</Button>
			<div className='bottom-wave'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='300'
					height='160'
					viewBox='0 0 300 230'
					fill='none'
				>
					<path
						d='M0.368961 230.173C0.368961 230.173 93.2289 230.173 100.02 148.503C106.811 66.8326 190.758 83.4896 190.758 83.4896C190.758 83.4896 278.042 102.12 270.805 5.16169C271.674 -4.55591 273.531 4.87396 275.239 5.23909C281.686 5.38125 362.33 153.082 362.33 153.082L318.806 314.197L1.54901 232.149L0.368961 230.173Z'
						fill='#F8FFFC'
					/>
				</svg>
			</div>
		</div>
	);
};

export default Sidebar;
