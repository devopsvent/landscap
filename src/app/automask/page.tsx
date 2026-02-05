import React from "react";
import AutoMask from "@/components/Dashboard/AutoMask";
import DashboardLayout from "@/components/Dashboard";

const Page = () => {
	return (
		<div>
			<DashboardLayout>
				<AutoMask />
			</DashboardLayout>
		</div>
	);
};

export default Page;
