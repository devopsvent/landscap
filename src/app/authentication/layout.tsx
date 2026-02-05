"use client";

import React, { useState } from "react";
import WavyCard from "@/ui/WavyCard";
import { AuthLayoutContext, useAuthLayout } from "@/context/AuthLayoutContext";
import "./index.css";

function LayoutContent({ children }: { children: React.ReactNode }) {
	const { title, span1, span2 } = useAuthLayout();
	return (
		<div className='auth-layout-wrapper flex h-auto'>
			<WavyCard title={title} span1={span1} span2={span2} />
			{children}
		</div>
	);
}

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [layout, setLayout] = useState({
		title: "Start Your",
		span1: "JOURNEY",
		span2: "WITH Us.",
	});

	return (
		<AuthLayoutContext.Provider value={{ ...layout, setLayout }}>
			<LayoutContent>{children}</LayoutContent>
		</AuthLayoutContext.Provider>
	);
}
