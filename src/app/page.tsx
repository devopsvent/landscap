import React from "react";
import AuthLayout from "@/app/authentication/layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Signin from "@/components/Signin";

export default async function Home() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("accessToken")?.value;

	if (token) {
		redirect("/dashboard");
	}
	return (
		<AuthLayout>
			<Signin />
		</AuthLayout>
	);
}
