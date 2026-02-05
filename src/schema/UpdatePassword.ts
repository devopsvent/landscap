import { z } from "zod";

export const schema = z
	.object({
		oldPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type FormData = z.infer<typeof schema>;
