"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import "./index.css";
import { UserData } from "@/types/profile";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, FormData } from "@/schema/UserProfile";
import toast from "react-hot-toast";
import { fetchUserProfile, updateUserProfile } from "@/services/UserProfile";
import { Country, State } from "country-state-city";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "primereact/avatar";
import { getPresignedUrl, uploadToS3 } from "@/services/UploadProfilePicture";
import { useUser } from "@/context/UserContext";

const UserProfile = () => {
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(false);
	const [editorLoading, setEditorLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [profileImageUrl, setProfileImageUrl] = useState("");
	const [userData, setUserData] = useState<UserData>();
	const [countries, setCountries] = React.useState<
		{ name: string; isoCode: string }[]
	>([]);
	const [states, setStates] = React.useState<
		{ name: string; isoCode: string }[]
	>([]);
	const { setUser } = useUser();
	const safeImage =
		profileImageUrl &&
		profileImageUrl !== "null" &&
		profileImageUrl !== "undefined"
			? profileImageUrl
			: undefined;

	const initials = userData
		? `${userData.firstName?.[0] ?? ""}${userData.lastName?.[0] ?? ""}`
		: undefined;

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: userData?.firstName,
			lastName: userData?.lastName,
			phone: userData?.phone,
			profileImg: userData?.profileImg,
			country: { name: userData?.addresses?.country, isoCode: "" },
			state: { name: userData?.addresses?.state, isoCode: "" },
		},
	});

	const fetchUserData = async () => {
		const fetchedData = await fetchUserProfile(setLoading);
		setUserData({
			firstName: fetchedData.data.firstName,
			lastName: fetchedData.data.lastName,
			phone: fetchedData.data.phone,
			email: fetchedData.data.email,
			profileImg: fetchedData.data.profileImg,
			addresses: fetchedData.data.addresses,
		});
		setProfileImageUrl(fetchedData.data.profileImg);
		reset({
			firstName: fetchedData.data.firstName || "",
			lastName: fetchedData.data.lastName || "",
			phone: fetchedData.data.phone || "",
			profileImg: fetchedData.data.profileImg,
			country: {
				name: fetchedData.data.addresses?.country,
				isoCode: "US",
			},
			state: { name: fetchedData.data.addresses?.state, isoCode: "NY" },
		});
		setUser(fetchedData.data);
	};

	React.useEffect(() => {
		fetchUserData();
	}, []);

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

	const selectedCountry = watch("country");

	React.useEffect(() => {
		const allCountries = Country.getAllCountries();
		setCountries(
			allCountries.map((c) => ({ name: c.name, isoCode: c.isoCode })),
		);
	}, []);

	React.useEffect(() => {
		if (selectedCountry) {
			const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
			setStates(
				allStates.map((s) => ({ name: s.name, isoCode: s.isoCode })),
			);
		}
	}, [selectedCountry]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setImageLoading(true);
			const { url } = await getPresignedUrl();
			const UploadImageURL = `${url}`;
			await uploadToS3(UploadImageURL, file);
			const imageUrl = url.split("?")[0];
			setProfileImageUrl(imageUrl);
		} catch (error) {
			console.error("Upload failed", error);
		} finally {
			setImageLoading(false);
		}
	};

	const onSubmit = async (data: FormData) => {
		try {
			setEditorLoading(true);
			const payload = {
				firstName: data.firstName,
				lastName: data.lastName,
				phone: data.phone,
				profileImg: profileImageUrl!,
				address: {
					country: data.country.name,
					state: data.state.name,
				},
			};
			await updateUserProfile(payload);
			toast.success("Profile updated successfully");
			fetchUserData();
			setEditMode(false);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Something went wrong...";
			console.error(errorMessage);
		} finally {
			setEditorLoading(false);
		}
	};

	const header = (
		<div className='align-items-center justify-content-between flex p-3'>
			<div className='align-items-center flex'>
				<h2 className='m-0 text-xl font-bold'>Profile Information</h2>
			</div>
			<div>
				{editMode ? (
					<div className='flex gap-2'>
						<Button
							icon='pi pi-times'
							className='p-button-rounded p-button-text p-button-danger'
							onClick={toggleEditMode}
							tooltip='Cancel'
						/>
					</div>
				) : (
					<Button
						icon='pi pi-pencil'
						className='p-button-rounded p-button-text'
						onClick={toggleEditMode}
						tooltip='Edit Profile'
					/>
				)}
			</div>
		</div>
	);

	return (
		<div className='surface-ground px-4 py-4'>
			<div className='flex-column flex'>
				{loading || imageLoading ? (
					<Skeleton shape='circle' size='8rem'></Skeleton>
				) : (
					<Avatar
						image={safeImage}
						label={!safeImage ? initials : undefined}
						size='xlarge'
						shape='circle'
						className={
							editMode ? "edit-profile-image" : "profile-image"
						}
					/>
				)}
				{editMode && (
					<div className='mt-2 flex flex-row'>
						<Button
							icon='pi pi-pencil'
							className='p-button-rounded p-button-text'
							onClick={handleUploadClick}
							label={
								imageLoading
									? "Uploading Profile Picture"
									: "Update Profile Picture"
							}
							disabled={imageLoading}
						/>
						<input
							type='file'
							accept='image/*'
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</div>
				)}
			</div>
			<div className='grid'>
				<div className='col-12 md:col-12'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='email-form mt-4'
					>
						{loading ? (
							<Skeleton width='100%' height='350px'></Skeleton>
						) : (
							<Card header={header} className='mb-4'>
								<div className='formgrid p-fluid grid'>
									<div className='field col-12 md:col-6'>
										<label
											htmlFor='firstName'
											className='text-900 mb-2 block font-semibold'
										>
											First Name
										</label>
										{editMode ? (
											<>
												<Controller
													name='firstName'
													control={control}
													render={({ field }) => (
														<InputText
															id='firstName'
															{...field}
															className='p-inputtext-rounded full-width mt-3'
															placeholder='John'
														/>
													)}
												/>
												{errors.firstName && (
													<small className='p-error'>
														{
															errors.firstName
																.message
														}
													</small>
												)}
											</>
										) : (
											<p className='text-color-secondary'>
												{userData?.firstName}
											</p>
										)}
									</div>
									<div className='field col-12 md:col-6'>
										<label
											htmlFor='lastName'
											className='text-900 mb-2 block font-semibold'
										>
											Last Name
										</label>
										{editMode ? (
											<>
												<Controller
													name='lastName'
													control={control}
													render={({ field }) => (
														<InputText
															id='lastName'
															{...field}
															className='p-inputtext-rounded full-width mt-3'
															placeholder='Doe'
														/>
													)}
												/>
												{errors.lastName && (
													<small className='p-error'>
														{
															errors.lastName
																.message
														}
													</small>
												)}
											</>
										) : (
											<p className='text-color-secondary'>
												{userData?.lastName}
											</p>
										)}
									</div>
									<div className='field col-12 md:col-6'>
										<label
											htmlFor='phone'
											className='text-900 mb-2 block font-semibold'
										>
											Phone
										</label>
										{editMode ? (
											<>
												<Controller
													name='phone'
													control={control}
													render={({ field }) => (
														<InputText
															id='phone'
															{...field}
															className='p-inputtext-rounded full-width mt-3'
															placeholder='+1 123-456-7890'
														/>
													)}
												/>
												{errors.phone && (
													<small className='p-error'>
														{errors.phone.message}
													</small>
												)}
											</>
										) : (
											<p className='text-color-secondary'>
												{userData?.phone}
											</p>
										)}
									</div>
									<div className='field col-12 md:col-6'>
										{!editMode && (
											<>
												<label
													htmlFor='email'
													className='text-900 mb-2 block font-semibold'
												>
													Email
												</label>
												<p className='text-color-secondary'>
													{userData?.email}
												</p>
											</>
										)}
									</div>
									<div className='field col-12 md:col-6'>
										<label
											htmlFor='address'
											className='text-900 mb-2 block font-semibold'
										>
											Country
										</label>
										{editMode ? (
											<>
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
														/>
													)}
												/>
												{errors.country && (
													<small className='p-error'>
														{errors.country.message}
													</small>
												)}
											</>
										) : (
											<p className='text-color-secondary'>
												{userData?.addresses?.country}
											</p>
										)}
									</div>
									<div className='field col-12 md:col-6'>
										<label
											htmlFor='address'
											className='text-900 mb-2 block font-semibold'
										>
											State
										</label>
										{editMode ? (
											<>
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
														/>
													)}
												/>
												{errors.state && (
													<small className='p-error'>
														{errors.state.message}
													</small>
												)}
											</>
										) : (
											<p className='text-color-secondary'>
												{userData?.addresses?.state}
											</p>
										)}
									</div>
								</div>
								{editMode && (
									<Button
										label={
											editorLoading
												? "Updating..."
												: "UPDATE"
										}
										icon={
											editorLoading
												? "pi pi-spinner pi-spin"
												: undefined
										}
										disabled={editorLoading}
										type='submit'
										className='submit-btn gap-6'
									/>
								)}
							</Card>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
