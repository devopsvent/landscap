"use client";
import SignupForm from "./SignupForm";
import { useAuthLayout } from "@/context/AuthLayoutContext";
import { useEffect } from "react";
import "./index.css";

const Signup = () => {
	const { setLayout } = useAuthLayout();

	useEffect(() => {
		setLayout?.({
			title: "Start Your",
			span1: "JOURNEY",
			span2: "WITH US.",
		});
	}, []);

	return <SignupForm />;
};

export default Signup;
