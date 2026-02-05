"use client";
import "@aws-amplify/ui-react/styles.css";
import React, { useEffect } from "react";
import SigninForm from "./SigninForm";
import { useAuthLayout } from "@/context/AuthLayoutContext";

const Signin = () => {
	const { setLayout } = useAuthLayout();

	useEffect(() => {
		setLayout?.({
			title: "Let's Setup Your Yard with",
			span1: "AI POWERED",
			span2: "DESIGN",
		});
	}, []);
	return <SigninForm />;
};

export default Signin;
