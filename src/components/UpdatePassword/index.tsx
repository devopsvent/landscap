"use client";
import React from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./index.css";
import { schema, FormData } from "@/schema/UpdatePassword";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";
import { updatePassword } from "aws-amplify/auth";

const UpdatePassword = () => {
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);
			await updatePassword({
				oldPassword: data.oldPassword,
				newPassword: data.password,
			});
			toast.success("Password updated successfully");
			router.push("/dashboard");
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
		<div className='flex-column align-items-center mt-6 flex'>
			<div
				className={
					errors.oldPassword ? "error-form-wrapper" : "form-wrapper"
				}
			>
				<div className='form-header'>
					<span className='password-text border-round-3xl'>
						Update Password
					</span>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='email-form mt-4'
				>
					<label className='justify-content-start flex'>
						Old Password
					</label>
					<Controller
						name='oldPassword'
						control={control}
						render={({ field }) => (
							<Password
								{...field}
								toggleMask
								feedback={false}
								className={` ${errors.password ? "p-invalid full-width mt-1" : "full-width mb-3 mt-1"}`}
								placeholder='Enter Your Old Password'
							/>
						)}
					/>
					{errors.oldPassword && (
						<small className='p-error'>
							{errors.oldPassword.message}
						</small>
					)}

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
								className={` ${errors.password ? "p-invalid full-width mt-1" : "full-width mb-3 mt-1"}`}
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
								className={` ${errors.password ? "p-invalid full-width mt-1" : "full-width mb-3 mt-1"}`}
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
						label={loading ? "Updating Your Password..." : "Save"}
						icon={loading ? "pi pi-spinner pi-spin" : undefined}
						disabled={loading}
					/>
				</form>
			</div>
		</div>
	);
};

export default UpdatePassword;
