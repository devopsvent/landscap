import * as z from "zod";

export const schema = z.object({
	otp: z
		.string()
		.min(6, "OTP must be 6 digits")
		.max(6, "OTP must be 6 digits"),
});

export type FormData = z.infer<typeof schema>;
