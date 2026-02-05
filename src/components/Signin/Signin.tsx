"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React from "react";

const Signin = () => {
	return (
		<div>
			<Authenticator />
		</div>
	);
};

export default Signin;
