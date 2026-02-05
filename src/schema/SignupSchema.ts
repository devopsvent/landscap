import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const CountrySchema = z.object({
	name: z.string(),
	isoCode: z.string(),
});

export const StateSchema = z.object({
	name: z.string(),
	isoCode: z.string(),
});

export const SignupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Invalid password"),
	phone: z
		.string()
		.min(1, { message: "Phone number is required" })
		.refine((val) => isValidPhoneNumber(val), {
			message: "Invalid phone number",
		}),
	country: CountrySchema,
	state: StateSchema,
	acceptTerms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the Terms of Service",
	}),
});

// Inferred type
export type SignupFormValues = z.infer<typeof SignupSchema>;
