import { z } from "zod";

export const SigninSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Minimum 6 characters"),
	rememberPassword: z.boolean().optional(),
});

export type SigninFormValues = z.infer<typeof SigninSchema>;
