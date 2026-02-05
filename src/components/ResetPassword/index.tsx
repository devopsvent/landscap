"use client";
import React from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./index.css";
import { schema, FormData } from "@/schema/ResetPassword";
import { confirmResetPassword } from "aws-amplify/auth";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/ui/Logo";
import { Password } from "primereact/password";

const ResetPassword = () => {
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const code = searchParams.get("code") || "";
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);
			await confirmResetPassword({
				username: email,
				confirmationCode: code,
				newPassword: data.password,
			});
			toast.success("Password reset successfully");
			router.push("/authentication/signin");
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Something went wrong...";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className='flex-column justify-content-center align-items-center flex h-screen'>
			<Logo />
			<div className='form-wrapper'>
				<div className='form-header'>
					<span className='forgot-text justify-content-end border-round-right-3xl absolute left-0 flex'>
						New
					</span>
					<span className='password-text border-round-3xl w-12'>
						<span>Password</span>
					</span>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='email-form mt-4'
				>
					<label className='justify-content-start flex'>
						New Password
					</label>
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<Password
								{...field}
								toggleMask
								feedback={false}
								className={` ${errors.password ? "p-invalid mt-1" : "mb-3 mt-1"}`}
								placeholder='Enter Your New Password'
							/>
						)}
					/>
					{errors.password && (
						<small className='p-error'>
							{errors.password.message}
						</small>
					)}

					<label className='justify-content-start flex'>
						Confirm New Password
					</label>
					<Controller
						name='confirmPassword'
						control={control}
						render={({ field }) => (
							<Password
								{...field}
								toggleMask
								feedback={false}
								className={` ${errors.password ? "p-invalid mt-1 w-full" : "mb-3 mt-1 w-full"}`}
								placeholder='Confirm Password'
							/>
						)}
					/>

					{errors.confirmPassword && (
						<small className='p-error'>
							{errors.confirmPassword.message}
						</small>
					)}
					{/* </span> */}

					<Button
						className='continue-btn'
						type='submit'
						label={loading ? "Resetting Your Password..." : "Save"}
						icon={loading ? "pi pi-spinner pi-spin" : undefined}
						disabled={loading}
					/>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
