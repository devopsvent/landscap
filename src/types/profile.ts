export interface ProfileProps {
	onTabChange: (tab: string) => void;
}

export interface UserData {
	firstName: string;
	lastName: string;
	phone: string;
	profileImg: string;
	email?: string;
	addresses: {
		country: string;
		state: string;
		zipCode?: string;
	};
}

export interface UpdateUserData {
	firstName: string;
	lastName: string;
	phone: string;
	profileImg: string;
	email?: string;
	address: {
		country: string;
		state: string;
	};
}
