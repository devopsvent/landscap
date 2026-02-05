import { z } from "zod";

export const zipSchema = z.object({
	zipCode: z
		.string()
		.min(5, "Zip Code must be at least 5 digits")
		.max(10, "Zip Code must be at most 10 digits")
		.regex(/^[0-9]+$/, "Zip Code must contain only numbers"),
});

export type ZipFormValues = z.infer<typeof zipSchema>;
