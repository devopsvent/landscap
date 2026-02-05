"use client";
import { Card } from "primereact/card";
import "./index.css";
import { useEffect, useState } from "react";
import { Plan } from "@/types/Subscription";
import {
	createSubscriptionSession,
	fetchPlans,
} from "@/services/SubscriptionService";
import { subscriptionFeatures } from "@/constants";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const ChangePlan = () => {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
	const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
		{},
	);
	const router = useRouter();

	const togglePlanExpansion = (planId: string) => {
		setExpandedPlans((prev) => ({
			...prev,
			[planId]: !prev[planId],
		}));
	};

	useEffect(() => {
		const getPlans = async () => {
			try {
				const response = await fetchPlans();
				const enrichedPlans = response.data.map((plan) => {
					const matchedFeature = subscriptionFeatures.find(
						(f) => f.name === plan.name,
					);

					return {
						...plan,
						features: matchedFeature?.features ?? [],
					};
				});

				setPlans(enrichedPlans);
			} catch (err) {
				console.error("Failed to fetch plans:", err);
			} finally {
				setLoading(false);
			}
		};

		getPlans();
	}, []);

	const renderSkeletons = () => {
		return (
			<div className='justify-content-center mt-8 flex'>
				<div className='flex gap-5'>
					{Array.from({ length: 2 }).map((_, i) => (
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
			console.error("Failed to update:", err);
		} finally {
			setLoadingPriceId(null);
		}
	};

	return (
		<div className='subscription-container'>
			<div className='custom-border align-items-center mb-4 flex px-2'>
				<i
					className='pi pi-arrow-left mr-2 cursor-pointer text-xl'
					onClick={() => router.push("/dashboard/subscription")}
				></i>

				<h2 className='ml-4 text-2xl font-semibold'>Pick a plan</h2>
			</div>

			{/* <SubscribedPlan/> */}
			<p className='text-ms font-normal'>
				Gain precise control over your landscaping projects with the
				ability to place and size dozens of elements. Cancel anytime.
			</p>

			{loading ? (
				renderSkeletons()
			) : (
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
										<span className='dollar-sign'>$</span>
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
													!expandedPlans[plan.id] &&
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
																		{email}
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
								<div className='mt-3 text-center'>
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
										handleSubscribe(plan.prices[0].priceId)
									}
								/>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ChangePlan;
