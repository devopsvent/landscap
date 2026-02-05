import { z } from "zod";
import { CountrySchema, StateSchema } from "./SignupSchema";

export const schema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().min(10, "Phone must be at least 10 digits"),
	country: CountrySchema,
	state: StateSchema,
	profileImg: z.any().optional(),
});

export type FormData = z.infer<typeof schema>;
