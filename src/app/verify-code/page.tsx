import VerifyCode from "@/components/VerificationCode";
import React, { JSX } from "react";

const Page: React.FC = (): JSX.Element => {
	return (
		<div>
			<VerifyCode routeName='verify-email' />
		</div>
	);
};

export default Page;
