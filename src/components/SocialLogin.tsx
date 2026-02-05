import React from "react";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
import { signInWithRedirect } from "aws-amplify/auth";
import { SocialLoginProps } from "@/types";

const SocialLogin: React.FC<SocialLoginProps> = ({ name }) => {
	const handleSocialLogin = async (
		provider: "Google" | "Facebook" | "SignInWithApple",
	) => {
		try {
			await signInWithRedirect({
				provider: {
					custom: provider,
				},
			});
		} catch (err) {
			console.error("Social login error:", err);
		}
	};
	return (
		<div
			style={{
				textAlign: "center",
				marginTop: "2rem",
				marginBottom: "2rem",
			}}
		>
			<p className='text-color-secondary mb-4 text-center font-medium'>
				Or {name} WITH
			</p>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "1.5rem",
				}}
			>
				{/* Google */}
				<div
					style={{
						backgroundColor: "#EA4335",
						borderRadius: "50%",
						width: "3rem",
						height: "3rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
					}}
					onClick={() => handleSocialLogin("Google")}
				>
					<FaGoogle color='#fff' size={20} />
				</div>

				{/* Apple */}
				<div
					style={{
						backgroundColor: "#000",
						borderRadius: "50%",
						width: "3rem",
						height: "3rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
					}}
					onClick={() => handleSocialLogin("SignInWithApple")}
				>
					<FaApple color='#fff' size={20} />
				</div>

				{/* Facebook */}
				<div
					style={{
						border: "2px solid #1877F2",
						borderRadius: "50%",
						width: "3rem",
						height: "3rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
					}}
					onClick={() => handleSocialLogin("Facebook")}
				>
					<FaFacebookF color='#1877F2' size={20} />
				</div>
			</div>
		</div>
	);
};

export default SocialLogin;
