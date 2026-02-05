import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { SignupFormValues, SignupSchema } from "@/schema/SignupSchema";
import { signUp } from "aws-amplify/auth";
import "./index.css";
import SocialLogin from "../SocialLogin";
import Link from "next/link";
import { AwsCognitoAttributes } from "@/enums/Signup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Password } from "primereact/password";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const SignupForm = () => {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

	const [countries, setCountries] = React.useState<
		{ name: string; isoCode: string }[]
	>([]);
	const [states, setStates] = React.useState<
		{ name: string; isoCode: string }[]
	>([]);
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupFormValues>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			phone: "",
			country: { name: "United States", isoCode: "US" },
			state: { name: "New York", isoCode: "NY" },
			acceptTerms: false,
		},
	});
	const selectedCountry = watch("country");

	useEffect(() => {
		const allCountries = Country.getAllCountries();
		setCountries(
			allCountries.map((c) => ({ name: c.name, isoCode: c.isoCode })),
		);
	}, []);

	useEffect(() => {
		if (selectedCountry) {
			const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
			setStates(
				allStates.map((s) => ({ name: s.name, isoCode: s.isoCode })),
			);
		}
	}, [selectedCountry]);

	const onSubmit = async (data: SignupFormValues) => {
		try {
			setLoading(true);
			const {
				email,
				password,
				firstName,
				lastName,
				phone,
				country,
				state,
			} = data;
			const { isSignUpComplete } = await signUp({
				username: email,
				password: password,
				options: {
					userAttributes: {
						[AwsCognitoAttributes.EMAIL]: email,
						[AwsCognitoAttributes.PHONE_NUMBER]: phone,
						[AwsCognitoAttributes.FIRST_NAME]: firstName,
						[AwsCognitoAttributes.LAST_NAME]: lastName,
						[AwsCognitoAttributes.ROLE]: "user",
						[AwsCognitoAttributes.COUNTRY]: country.name,
						[AwsCognitoAttributes.STATE]: state.name,
					},
				},
			});
			if (isSignUpComplete) {
				toast.success("Signup successful! 🎉");
			} else {
				toast("Check your email to verify your account.");
				router.push(`/verify-code?email=${encodeURIComponent(email)}`);
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

	return (
		<div
			style={{ width: "100%", maxWidth: "40rem", marginTop: "82px" }}
			className='ml-auto mr-auto'
		>
			<form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
				{/* First Name & Last Name */}
				<div className='form-row'>
					<div className='form-group mb-4'>
						<label>First Name</label>
						<Controller
							name='firstName'
							control={control}
							render={({ field }) => (
								<InputText
									{...field}
									className='p-inputtext-rounded full-width mt-3'
									placeholder='Kevin'
									pt={{
										root: {
											className: "custom-input-signup",
										},
									}}
								/>
							)}
						/>
						{errors.firstName && (
							<small className='p-error ml-4'>
								{errors.firstName.message}
							</small>
						)}
					</div>
					<div className='form-group mb-4'>
						<label>Last Name</label>
						<Controller
							name='lastName'
							control={control}
							render={({ field }) => (
								<InputText
									{...field}
									className='p-inputtext-rounded full-width mt-3'
									placeholder='Cooper'
									pt={{
										root: {
											className: "custom-input-signup",
										},
									}}
								/>
							)}
						/>
						{errors.lastName && (
							<small className='p-error ml-4'>
								{errors.lastName.message}
							</small>
						)}
					</div>
				</div>

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
										className: "custom-input-signup",
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

				{/* Country & State */}
				<div className='form-row mb-4'>
					<div className='form-group'>
						<label>Country of Residence</label>
						<Controller
							name='country'
							control={control}
							render={({ field }) => (
								<Dropdown
									{...field}
									options={countries}
									optionLabel='name'
									placeholder='Country'
									className='p-dropdown-rounded full-width mt-3'
									pt={{
										root: {
											className: "custom-input-signup",
										},
									}}
								/>
							)}
						/>
						{errors.country && (
							<small className='p-error ml-4'>
								{errors.country.message}
							</small>
						)}
					</div>
					<div className='form-group'>
						<label>State</label>
						<Controller
							name='state'
							control={control}
							render={({ field }) => (
								<Dropdown
									{...field}
									options={states}
									optionLabel='name'
									placeholder='State'
									className='p-dropdown-rounded full-width mt-3'
									pt={{
										root: {
											className: "custom-input-signup",
										},
									}}
								/>
							)}
						/>
						{errors.state && (
							<small className='p-error ml-4'>
								{errors.state.message}
							</small>
						)}
					</div>
				</div>

				{/* Phone Number */}
				<div className='form-group mb-4'>
					<label>Phone Number</label>
					<Controller
						name='phone'
						control={control}
						render={({ field }) => (
							<PhoneInput
								{...field}
								defaultCountry='US'
								className={`react-phone-input mt-3 ${errors.phone ? "p-invalid" : ""}`}
								placeholder='Enter phone number'
								pt={{
									root: {
										className: "custom-input-signup",
									},
								}}
							/>
						)}
					/>
					{errors.phone && (
						<small className='p-error ml-7'>
							{errors.phone.message}
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
										className:
											"custom-password-input-signup",
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

				{/* Terms & Conditions */}
				<div className='form-checkbox-signup ml-2 mt-5'>
					<div className='checkbox-line'>
						<Controller
							name='acceptTerms'
							control={control}
							render={({ field }) => (
								<div className='align-items-center justify-content-center flex'>
									<Checkbox
										inputId='terms'
										checked={field.value}
										onChange={(e) =>
											field.onChange(e.checked)
										}
									/>
									<label htmlFor='terms' className='ml-1'>
										By Clicking, you agree to our Terms of
										Use and Privacy Policy.
									</label>
								</div>
							)}
						/>
					</div>
					{errors.acceptTerms && (
						<small className='p-error ml-4'>
							{errors.acceptTerms.message}
						</small>
					)}
				</div>
				{/* Submit Button */}
				<Button
					label={loading ? "Signing up..." : "SIGN UP"}
					icon={loading ? "pi pi-spinner pi-spin" : undefined}
					disabled={loading}
					type='submit'
					className='submit-btn gap-6'
				/>

				<SocialLogin name='SIGNUP' />

				<p className='text-color-secondary mb-4 text-center font-medium'>
					Already have an account?{" "}
					<Link
						className='cursor-pointer no-underline'
						href='/authentication/signin'
					>
						<span style={{ color: "#ff9c3e" }}>SIGN IN</span>
					</Link>
				</p>
			</form>
		</div>
	);
};

export default SignupForm;
