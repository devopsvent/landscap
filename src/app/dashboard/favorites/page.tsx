import React from "react";
import Favorites from "@/components/Dashboard/Favorites";
import DashboardLayout from "@/components/Dashboard";

const Page = () => {
	return (
		<div>
			<DashboardLayout>
				<Favorites />
			</DashboardLayout>
		</div>
	);
};

export default Page;
