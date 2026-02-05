import Home from "@/components/Dashboard/Home";
import DashboardLayout from "@/components/Dashboard";
const Page = async () => {
	return (
		<div>
			<DashboardLayout>
				<Home />
			</DashboardLayout>
		</div>
	);
};

export default Page;
