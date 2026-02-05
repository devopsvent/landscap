"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Logout = () => {
	const router = useRouter();
	return (
		<button
			onClick={async () => {
				await signOut();
				router.push("/signup");
			}}
			className='bg-white px-2 text-black'
		>
			Sign out
		</button>
	);
};

export default Logout;
