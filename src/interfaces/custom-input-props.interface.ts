import React, { InputHTMLAttributes } from "react";

export interface CustomInputProps
	extends InputHTMLAttributes<HTMLInputElement> {
	events: React.HTMLAttributes<HTMLInputElement>;
	props: React.HTMLAttributes<HTMLInputElement>;
}
