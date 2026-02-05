export interface Price {
	priceId: string;
	amount: number;
	currency?: string;
	interval?: string;
}

export interface Plan {
	id: string;
	name: string;
	description: string;
	prices: Price[];
	features: string[];
	isComingSoon?: boolean;
}

export interface FetchPlansResponse {
	data: Plan[];
	message: string;
	success: boolean;
}

export interface CreateSessionPayload {
	priceId: string;
}

export interface CreateSessionResponse {
	success: boolean;
	message: string;
	data?: {
		url: string;
	};
}

export interface SubscribedPlanProps {
	planName: string;
	price: string;
	nextBillingDate: string;
	planType: string;
	status: string;
	onCancel: () => void;
	updateCard: () => void;
	updateCardLoader: boolean;
}

export interface UpdateSessionPayload {
	priceId: string;
}

export interface CancelSubscriptionPayload {
	priceId: string;
}

export interface UserSubscription {
	planType: string;
	isActive: boolean;
	currentPeriodEnd: Date | null;
	status: string;
	stripePriceId: string;
}

export interface UserSubscriptionResponse {
	data: UserSubscription;
	message: string;
	success: boolean;
}
