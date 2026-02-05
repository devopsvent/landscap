"use client";
import { Card } from "primereact/card";
import "./index.css";
import SubscribedPlan from "./SubscribedPlan";
import { useEffect, useState } from "react";
import { Plan, UserSubscription } from "@/types/Subscription";
import {
	cancelUserSubscription,
	createSubscriptionSession,
	fetchPlans,
	fetchUserSubscription,
	updateCard,
} from "@/services/SubscriptionService";
import { subscriptionFeatures } from "@/constants";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { useSearchParams } from "next/navigation";

const Subscription = () => {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [updateCardLoader, setUpdateCardLoader] = useState(false);
	const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
	const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
		{},
	);
	const [userSubscription, setUserSubscription] =
		useState<UserSubscription | null>(null);
	const [userPlanType, setUserPlanType] = useState<
		"FREE" | "BASE" | "PERSONALIZED" | null
	>(null);
	const planPriceMap: Record<string, string> = {
		FREE: "$0",
		BASE: "$299",
		PERSONALIZED: "$799",
	};
	const searchParams = useSearchParams();
	const showSubscribedPlan =
		userPlanType === "BASE" ||
		userPlanType === "PERSONALIZED" ||
		searchParams?.get("subscribed") === "true";

	const loadSubscriptionData = async () => {
		const [userSubResult, plansResult] = await Promise.allSettled([
			fetchUserSubscription(),
			fetchPlans(),
		]);

		if (userSubResult.status === "fulfilled") {
			const subscriptionData: UserSubscription = {
				...userSubResult.value.data,
				currentPeriodEnd: userSubResult.value.data.currentPeriodEnd
					? new Date(userSubResult.value.data.currentPeriodEnd)
					: null,
			};

			setUserSubscription(subscriptionData);
			setUserPlanType(userSubResult.value.data?.planType || null);
		} else {
			console.error(
				"User subscription fetch failed",
				userSubResult.reason,
			);
		}
		let enrichedPlans: Plan[] = [];
		if (plansResult.status === "fulfilled") {
			enrichedPlans = plansResult.value.data.map((plan) => {
				const matched = subscriptionFeatures.find(
					(f) => f.name === plan.name,
				);
				return {
					...plan,
					features: matched?.features ?? [],
					isComingSoon: false,
				};
			});
		} else {
			console.error("Plans fetch failed", plansResult.reason);
		}

		const comingSoonPlans = ["Pro Plan", "Commercial Plan"];
		const staticPlans: Plan[] = subscriptionFeatures
			.filter((feature) => comingSoonPlans.includes(feature.name))
			.map((feature): Plan => {
				const price =
					feature.name === "Pro Plan"
						? "79.00"
						: feature.name === "Commercial Plan"
							? "99.99"
							: "Coming Soon";

				return {
					id: feature.name.toLowerCase().replace(/\s/g, "-"),
					name: feature.name,
					description: "",
					prices: [
						{
							amount: parseInt(price),
							priceId: "",
							currency: "USD",
							interval: "one_time",
						},
					],
					features: feature.features,
					isComingSoon: true,
				};
			});

		setPlans([...enrichedPlans, ...staticPlans]);
		setLoading(false);
	};

	useEffect(() => {
		loadSubscriptionData();
	}, []);

	const renderSkeletons = () => {
		const skeletonCount = userPlanType
			? userPlanType === "FREE"
				? 1
				: plans.length || 2
			: 2;

		return (
			<div className='justify-content-center mt-8 flex'>
				<div className='flex gap-5'>
					{Array.from({ length: skeletonCount }).map((_, i) => (
						<div key={i}>
							<Skeleton
								width='500px'
								height='550px'
								className='border-round-3xl mb-5'
							/>
						</div>
					))}
				</div>
			</div>
		);
	};

	const handleSubscribe = async (priceId: string) => {
		try {
			setLoadingPriceId(priceId);
			const response = await createSubscriptionSession({ priceId });
			if (response.data?.url) {
				window.location.href = response.data.url;
			}
		} catch (err) {
			console.error("Failed to create checkout session:", err);
		} finally {
			setLoadingPriceId(null);
		}
	};

	const handleUpdateCard = async () => {
		try {
			setUpdateCardLoader(true);
			const response = await updateCard();
			if (response.data?.url) {
				window.location.href = response.data.url;
			}
		} catch (err) {
			console.error("Failed to update card:", err);
		} finally {
			setUpdateCardLoader(false);
		}
	};

	const handleCancelSubscription = async () => {
		const priceId = userSubscription?.stripePriceId;
		await cancelUserSubscription({
			priceId: priceId || "",
		});
		loadSubscriptionData();
	};

	const price = planPriceMap[userSubscription?.planType || "FREE"] || "$0";

	const togglePlanExpansion = (planId: string) => {
		setExpandedPlans((prev) => ({
			...prev,
			[planId]: !prev[planId],
		}));
	};

	return (
		<div className='subscription-container'>
			{loading ? (
				renderSkeletons()
			) : showSubscribedPlan ? (
				<SubscribedPlan
					planName='Monthly Plan'
					price={price}
					nextBillingDate={
						userSubscription?.currentPeriodEnd?.toLocaleDateString() ||
						"_"
					}
					planType={userSubscription?.planType || "FREE"}
					status={userSubscription?.status || "ACTIVE"}
					onCancel={handleCancelSubscription}
					updateCard={handleUpdateCard}
					updateCardLoader={updateCardLoader}
				/>
			) : (
				<div>
					<div className='custom-border justify-content-between align-items-center flex flex-shrink-0 px-2'>
						<h2 className='mb-4 text-2xl font-semibold'>
							Pick a plan
						</h2>
					</div>
					{/* <SubscribedPlan/> */}
					<p className='text-ms font-normal'>
						Gain precise control over your landscaping projects with
						the ability to place and size dozens of elements. Cancel
						anytime.
					</p>
					<div className='subscription-cards'>
						{plans.map((plan) => (
							<Card key={plan.id} className='subscription-card'>
								<div className='plan-header'>
									<div className='plan-title-container'>
										<span className='plan-title'>
											{plan.name}
										</span>
									</div>
									<div className='plan-description'>
										{plan.description}
									</div>
									<div className='price-circle'>
										<div className='price-content'>
											<span className='dollar-sign'>
												$
											</span>
											<span className='price'>
												{plan.prices[0].amount}
											</span>
											<div className='per-month'>
												One Time Cost
											</div>
										</div>
									</div>
								</div>

								<div className='features-list'>
									{plan.features
										.slice(
											0,
											expandedPlans[plan.id]
												? plan.features.length
												: 5,
										)
										.map((feature, index) => (
											<div
												key={index}
												className={
													index % 2 === 0
														? "feature-row"
														: "feature-row alternate"
												}
											>
												<div className='feature-check'>
													<i className='pi pi-check'></i>
												</div>
												<div
													className={
														!expandedPlans[
															plan.id
														] &&
														feature.length > 180
															? "feature-text clamp-2-lines"
															: "feature-text"
													}
												>
													{feature.includes("mailto:")
														? (() => {
																const parts =
																	feature.split(
																		/mailto:([^\s]+)/,
																	);
																const before =
																	parts[0];
																const email =
																	parts[1];
																const after =
																	parts[2];
																return (
																	<>
																		{before}
																		<a
																			href={`mailto:${email}`}
																		>
																			{
																				email
																			}
																		</a>
																		{after}
																	</>
																);
															})()
														: feature}
												</div>
											</div>
										))}
								</div>
								{plan.features.length > 5 && (
									<div className='mt-4 text-center'>
										<Button
											link
											label={
												expandedPlans[plan.id]
													? "Show Less"
													: "Show More"
											}
											onClick={() =>
												togglePlanExpansion(plan.id)
											}
											className='expanded-button border-0 bg-transparent p-0 shadow-none hover:underline'
										/>
									</div>
								)}
								<div className='subscription-actions'>
									{plan.isComingSoon ? (
										<Button
											className='subscribe-button cursor-not-allowed'
											label='Coming Soon'
											disabled
										/>
									) : (
										<Button
											className='subscribe-button'
											label='Subscribe'
											icon={
												loadingPriceId ===
												plan.prices[0].priceId
													? "pi pi-spinner pi-spin"
													: undefined
											}
											disabled={loadingPriceId !== null}
											onClick={() =>
												handleSubscribe(
													plan.prices[0].priceId,
												)
											}
										/>
									)}
								</div>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Subscription;
