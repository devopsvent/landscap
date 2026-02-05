import React from "react";
import DashboardLayout from "@/components/Dashboard";
import ChangePlan from "@/components/Dashboard/Subscription/ChangePlan";

const Page = () => {
	return (
		<div>
			<DashboardLayout>
				<ChangePlan />
			</DashboardLayout>
		</div>
	);
};

export default Page;
