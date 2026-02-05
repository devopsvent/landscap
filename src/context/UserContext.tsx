// context/UserContext.tsx
"use client";
import { UserData } from "@/types/profile";
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { usePathname, useRouter } from "next/navigation";

type UserContextType = {
	user: UserData | null;
	setUser: (user: UserData) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserData | null>(null);
	const pathName = usePathname();
	const router = useRouter();

	useEffect(() => {
		const checkUser = async () => {
			try {
				const currentUser = await getCurrentUser();
				if (currentUser && pathName.includes("authentication")) {
					router.replace("/dashboard");
				}
			} catch (error) {
				console.error(error);
			}
		};

		checkUser();
	}, [pathName, router]);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error("useUser must be used within a UserProvider");
	return context;
};
