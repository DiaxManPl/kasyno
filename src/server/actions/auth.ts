"use server";

import { compare, hash } from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";
import { createSession, deleteSession } from "../session";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { FormState, LoginFormSchema, SignUpFormSchema } from "@/lib/zod/auth";

export async function signUp(
	_state: FormState<typeof SignUpFormSchema>,
	raw: FormData,
): Promise<FormState<typeof SignUpFormSchema>> {
	const data = SignUpFormSchema.safeParse({
		username: raw.get("username"),
		password: raw.get("password"),
		passwordConfirmation: raw.get("passwordConfirmation"),
	});

	if (!data.success) return { errors: data.error.flatten().fieldErrors };

	const password = await hash(data.data.password, 10);

	const result = await db
		.insert(users)
		.values({
			username: data.data.username,
			password,
		})
		.onConflictDoNothing()
		.returning({ id: users.id, username: users.username });

	const user = result[0];
	if (!user) return { message: "Użytkownik o podanej nazwie już istnieje" };

	await createSession({ id: user.id, username: user.username });
	redirect("/");
}

export async function login(
	_state: FormState<typeof LoginFormSchema>,
	raw: FormData,
): Promise<FormState<typeof LoginFormSchema>> {
	const data = LoginFormSchema.safeParse({
		username: raw.get("username"),
		password: raw.get("password"),
	});

	if (!data.success) return { errors: data.error.flatten().fieldErrors };

	const user = await db
		.selectDistinct({ id: users.id, username: users.username, password: users.password })
		.from(users)
		.where(eq(users.username, data.data.username))
		.then((rows) => rows[0]);

	if (!user) return { message: "Nieprawidłowa nazwa użytkownika lub hasło" };

	const passwordMatch = await compare(data.data.password, user.password);
	if (!passwordMatch) return { message: "Nieprawidłowa nazwa użytkownika lub hasło" };

	await createSession({ id: user.id, username: user.username });
	redirect("/");
}

export async function logout() {
	deleteSession();
	redirect("/login");
}
