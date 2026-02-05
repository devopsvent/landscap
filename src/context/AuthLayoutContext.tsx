"use client";

import { createContext, useContext } from "react";

type LayoutText = {
	title: string;
	span1: string;
	span2: string;
	setLayout?: (values: {
		title: string;
		span1: string;
		span2: string;
	}) => void;
};

export const AuthLayoutContext = createContext<LayoutText | null>(null);

export const useAuthLayout = () => {
	const context = useContext(AuthLayoutContext);
	if (!context) {
		throw new Error(
			"useAuthLayout must be used within AuthLayoutContext.Provider",
		);
	}
	return context;
};
