import React from "react";
import GenerateAiImages from "@/components/Dashboard/GenerateImages";
import DashboardLayout from "@/components/Dashboard";

const Page = () => {
	return (
		<div>
			<DashboardLayout>
				<GenerateAiImages />
			</DashboardLayout>
		</div>
	);
};

export default Page;
