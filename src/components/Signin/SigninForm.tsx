import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { SigninFormValues, SigninSchema } from "@/schema/SigninSchema";
import { signIn } from "aws-amplify/auth";
import "./index.css";
import SocialLogin from "../SocialLogin";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Password } from "primereact/password";
import { setAccessTokenCookie } from "@/utils/accesstoken-handler";
import { Hub } from "aws-amplify/utils";

const SigninForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = React.useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninFormValues>({
		resolver: zodResolver(SigninSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberPassword: true,
		},
	});

	const onSubmit = async (data: SigninFormValues) => {
		try {
			setLoading(true);
			await signIn({
				username: data.email,
				password: data.password,
			});
			await setAccessTokenCookie();
			toast.success("Signed in successfully!");
			router.replace("/dashboard");
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

	React.useEffect(() => {
		const isSocialRedirect =
			searchParams.has("code") && searchParams.has("state");
		const errorDescription = searchParams.get("error_description");

		if (errorDescription) {
			toast.error(decodeURIComponent(errorDescription));
		}

		const unsubscribe = Hub.listen("auth", async ({ payload }) => {
			if (payload.event === "signedIn" && isSocialRedirect) {
				try {
					await setAccessTokenCookie();
					toast.success("Signed in successfully!");
					router.replace("/dashboard");
				} catch (error) {
					const errorMessage =
						error instanceof Error
							? error.message
							: "Something went wrong...";
					toast.error(errorMessage);
				}
			}
		});

		return () => unsubscribe();
	}, [router, searchParams]);

	return (
		<div
			style={{ width: "100%", maxWidth: "40rem", marginTop: "12%" }}
			className='ml-auto mr-auto'
		>
			<form onSubmit={handleSubmit(onSubmit)} className='signin-form'>
				{/* Email */}
				<div className='form-group mb-4'>
					<label>Email</label>
					<Controller
						name='email'
						control={control}
						render={({ field }) => (
							<InputText
								{...field}
								className='p-inputtext-rounded full-width mt-3'
								placeholder='example@mail.com'
								pt={{
									root: {
										className: "custom-input",
									},
								}}
							/>
						)}
					/>
					{errors.email && (
						<small className='p-error ml-4'>
							{errors.email.message}
						</small>
					)}
				</div>

				{/* Password */}
				<div className='form-group mb-4'>
					<label>Password</label>
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<Password
								{...field}
								toggleMask
								feedback={false}
								className={` ${errors.password ? "p-invalid mt-3 w-full" : "mt-3 w-full"}`}
								placeholder='Enter your password'
								pt={{
									root: { className: "my-password-wrapper" },
									input: {
										className: "custom-password-input",
									},
								}}
							/>
						)}
					/>
					{errors.password && (
						<small className='p-error ml-4'>
							{errors.password.message}
						</small>
					)}
				</div>
				<div className='justify-content-between align-items-center mb-5 mt-3 flex w-full'>
					<div className='align-items-center flex gap-2'>
						<Controller
							name='rememberPassword'
							control={control}
							render={({ field }) => (
								<>
									<Checkbox
										inputId='remember'
										checked={field.value!}
										onChange={(e) =>
											field.onChange(e.checked)
										}
									/>
									<label
										htmlFor='remember'
										className='text-color text-sm'
									>
										Remember Password
									</label>
								</>
							)}
						/>
						{errors.rememberPassword && (
							<small className='p-error block'>
								{errors.rememberPassword.message}
							</small>
						)}
					</div>
					<Link
						href='/forgot-password'
						className='text-color text-sm font-medium no-underline hover:underline'
					>
						Forgot Password?
					</Link>
				</div>

				{/* Submit Button */}
				<Button
					type='submit'
					className='submit-btn'
					label={loading ? "Signing in..." : "SIGN IN"}
					icon={loading ? "pi pi-spin pi-spinner" : ""}
					disabled={loading}
				/>

				<SocialLogin name='SIGNIN' />

				<p className='text-color-secondary mb-4 text-center font-medium'>
					Don&apos;t have an account?{" "}
					<Link
						className='cursor-pointer no-underline'
						href='/authentication/signup'
					>
						<span style={{ color: "#ff9c3e" }}>SIGN UP</span>
					</Link>
				</p>
			</form>
		</div>
	);
};

export default SigninForm;
