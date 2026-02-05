"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import "./index.css";
import Logo from "@/ui/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "primereact/button";
import { useRouter, useSearchParams } from "next/navigation";
import { InputOtp, InputOtpChangeEvent } from "primereact/inputotp";
import { FormData, schema } from "@/schema/VerificationCode";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { CustomInputProps } from "@/interfaces";
import { VerifyCodeProps } from "@/types";

const VerifyCode = ({ routeName }: VerifyCodeProps) => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();

	const customInput = ({ events, props }: CustomInputProps) => (
		<input
			{...events}
			{...props}
			type='text'
			className='custom-otp-input border-round-3xl w-5'
		/>
	);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			otp: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true);
			if (routeName === "verify-email") {
				await confirmSignUp({
					username: email,
					confirmationCode: data.otp,
				});
				toast.success("Email verified successfully!");
				router.push("/authentication/signin");
			} else {
				router.push(
					`/${routeName}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.otp)}`,
				);
			}
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

	const handleResendCode = async () => {
		try {
			setLoading(true);
			await resendSignUpCode({ username: email });
			toast.success("Code resent successfully!");
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
		<div className='flex-column justify-content-center align-items-center auth-layout-wrapperr flex h-screen'>
			<Logo />
			<div className='form-wrapper'>
				<div className='form-header'>
					<span className='forgot-text justify-content-end border-round-right-3xl absolute left-0 flex'>
						Verification
					</span>
					<span className='password-text border-round-3xl w-12'>
						<span>Code</span>
					</span>
				</div>
				<p className='description-text mt-5'>
					We have sent a 6 digit code to <br />
					{email || "jo*****33@gmail.com"}
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='email-form mt-4'
				>
					<Controller
						name='otp'
						control={control}
						render={({ field }) => (
							<InputOtp
								{...field}
								value={field.value}
								onChange={(e: InputOtpChangeEvent) =>
									field.onChange(e?.value)
								}
								inputTemplate={customInput as never}
								integerOnly
								length={6}
							/>
						)}
					/>
					{errors.otp && (
						<small className='p-error'>{errors.otp.message}</small>
					)}
					<p className='mt-3 text-center'>
						Did&apos;nt get a code?{" "}
						<span
							style={{ color: "#ffa530" }}
							className='cursor-pointer'
							onClick={handleResendCode}
						>
							Resend Code
						</span>
					</p>
					<Button
						className='continue-btn'
						type='submit'
						label={loading ? "processing..." : "Continue"}
						icon={loading ? "pi pi-spinner pi-spin" : undefined}
						disabled={loading}
					/>
				</form>
			</div>
		</div>
	);
};

export default VerifyCode;
