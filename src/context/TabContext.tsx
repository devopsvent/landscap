"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type TabContextType = {
	activeTab: string;
	setActiveTab: (tab: string) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
	const [activeTab, setActiveTab] = useState<string>("home");

	return (
		<TabContext.Provider value={{ activeTab, setActiveTab }}>
			{children}
		</TabContext.Provider>
	);
};

export const useTab = () => {
	const context = useContext(TabContext);
	if (!context) {
		throw new Error("useTab must be used inside TabProvider");
	}
	return context;
};
