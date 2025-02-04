import { z, type ZodType } from "zod";

export const SignUpFormSchema = z
	.object({
		username: z
			.string()
			.min(3, { message: "Nazwa użytkownika musi zawierać przynajmniej 3 znaki" })
			.trim()
			.toLowerCase(),
		password: z.string().min(8, { message: "Hasło musi zawierać przynajmniej 8 znaków" }),
		passwordConfirmation: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Hasła nie są takie same",
		path: ["passwordConfirmation"],
	});

export const LoginFormSchema = z.object({
	username: z.string().trim().toLowerCase(),
	password: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormState<T extends ZodType<any, any, any>> =
	| {
			errors?: Partial<Record<keyof z.infer<T>, string[]>>;
			message?: string;
	  }
	| undefined;
