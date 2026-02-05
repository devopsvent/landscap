"use client";
import React, { useState } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "./index.css";
import Sidebar from "./Sidebar";
import Topbar from "./Home/Topbar";
import { clearAccessTokenCookie } from "@/utils/accesstoken-handler";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleSignOut = async () => {
		try {
			setLoggingOut(true);
			await signOut();
			clearAccessTokenCookie();
			toast.success("Logged out successfully!");
			router.replace("/authentication/signin");
		} catch (error) {
			console.error("Sign out error:", error);
			toast.error("Failed to sign out.");
		} finally {
			setLoggingOut(false);
		}
	};

	return (
		<div className='dash-container flex h-screen overflow-visible'>
			{/* Sidebar */}
			<div className='w-[20%] flex-none bg-green-500 md:w-[20%] lg:w-[20%] xl:w-[20%]'>
				<Sidebar onLogout={handleSignOut} loggingOut={loggingOut} />
			</div>

			{/* Main Content */}
			<div className='ml-3 h-screen flex-1 overflow-y-auto p-5'>
				<div className='justify-content-end flex'>
					<Topbar />
				</div>
				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
