"use client";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./index.css";
import { schema, FormData } from "@/schema/ForgotPassword";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { resetPassword } from "aws-amplify/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Logo from "@/ui/Logo";

const ForgotPassword = () => {
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);
			const { email } = data;
			await resetPassword({ username: email });
			toast.success("Code sent successfully");
			router.push(
				`/forgot-password/verify-code?email=${encodeURIComponent(email)}`,
			);
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
		<div className='flex-column justify-content-center align-items-center auth-layout-wrappers flex h-screen'>
			<Logo />
			<div className='form-wrapper'>
				<div className='form-header'>
					<span className='forgot-text justify-content-end border-round-right-3xl absolute left-0 flex'>
						Forgot
					</span>
					<span className='password-text border-round-3xl w-12'>
						<span>Password?</span>
					</span>
				</div>

				<p className='description-text mt-5'>
					Please enter your email address and we will <br />
					send you a code on your register email.
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='email-form mt-4'
				>
					<IconField iconPosition='right'>
						<InputIcon className='pi pi-envelope mt-auto'>
							{" "}
						</InputIcon>
						<Controller
							name='email'
							control={control}
							render={({ field }) => (
								<InputText
									{...field}
									className={
										errors.email
											? "p-invalid p-inputtext-rounded full-width mt-3"
											: "p-inputtext-rounded full-width mt-3"
									}
									placeholder='Enter your email address'
									pt={{
										root: {
											className:
												"custom-input-forgot-password",
										},
									}}
								/>
							)}
						/>
					</IconField>
					{errors.email && (
						<small className='p-error'>
							{errors.email.message}
						</small>
					)}
					{/* </span> */}

					<Button
						className='continue-btn'
						type='submit'
						label={loading ? "Sending code..." : "Continue"}
						icon={loading ? "pi pi-spinner pi-spin" : undefined}
						disabled={loading}
					/>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
