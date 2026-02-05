import React from "react";
import Subscription from "@/components/Dashboard/Subscription";
import DashboardLayout from "@/components/Dashboard";

const Page = () => {
	return (
		<div>
			<DashboardLayout>
				<Subscription />
			</DashboardLayout>
		</div>
	);
};

export default Page;
