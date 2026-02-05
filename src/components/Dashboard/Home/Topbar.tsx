"use client";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import "../index.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { fetchUserProfile } from "@/services/UserProfile";
import { Skeleton } from "primereact/skeleton";

const Topbar = () => {
	const [loading, setLoading] = useState(true);
	const { user, setUser } = useUser();
	const userProfile = async () => {
		const fetchedData = await fetchUserProfile(setLoading);
		setUser(fetchedData.data);
	};
	const menuRef = useRef<OverlayPanel>(null);

	const toggleMenu = (event: React.MouseEvent) => {
		menuRef.current?.toggle(event);
	};

	const menuItems = [
		{ label: "Profile", icon: "pi pi-user", className: "custom-menu-item" },
		{ label: "Settings", icon: "pi pi-cog", className: "custom-menu-item" },
	];

	const router = useRouter();
	const handleTabChange = (tabName: string) => {
		router.push(`/${tabName}`);
		menuRef.current?.hide();
	};

	useEffect(() => {
		userProfile();
	}, []);

	return (
		<div className='mb-5 rounded-xl shadow-sm'>
			{/* Searchbar */}

			{/* Right Icons */}
			<div className='avatar flex gap-4'>
				{/* Notification Bell */}
				{/* <Button
					icon='pi pi-bell'
					className='p-button-text p-button-rounded ml-2 mt-1'
					aria-label='Notifications'
				/> */}

				{/* Profile Avatar and Dropdown */}
				<div>
					<div
						className='align-content-center align-items-center flex cursor-pointer gap-2'
						onClick={toggleMenu}
					>
						{loading || !user ? (
							<Skeleton shape='circle' size='2rem' />
						) : (
							<>
								<Avatar
									image={user?.profileImg}
									shape='circle'
									label={
										user && !user?.profileImg
											? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
											: undefined
									}
									className='mt-1 capitalize'
									size='large'
								/>
								<span className='font-medium text-gray-800'>
									{`${user?.firstName} ${user?.lastName}` ||
										"User"}
								</span>
								<i className='pi pi-chevron-down text-sm text-gray-600'></i>
							</>
						)}
					</div>
					<OverlayPanel ref={menuRef} className='custom-overlaypanel'>
						<ul className='w-12rem list-none'>
							{menuItems.map((item, idx) => (
								<li
									key={idx}
									className='custom-menu-item align-items-center flex cursor-pointer gap-2 rounded hover:bg-gray-100'
									onClick={() => {
										handleTabChange(
											item.label.toLowerCase(),
										);
									}}
								>
									<i className={`pi ${item.icon}`}></i>
									{item.label}
								</li>
							))}
						</ul>
					</OverlayPanel>
				</div>
			</div>
		</div>
	);
};

export default Topbar;
