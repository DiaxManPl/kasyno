"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/server/actions/auth";
import { useActionState } from "react";

export default function SignUpForm() {
	const [state, action, pending] = useActionState(signUp, undefined);

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Rejestracja</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="username">Nazwa użytkownika</Label>
								<Input id="username" name="username" type="text" required />
								{state?.errors?.username && <p className="text-red-600">{state.errors.username}</p>}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="password">Hasło</Label>
								<Input id="password" name="password" type="password" required />
								{state?.errors?.password && <p className="text-red-600">{state.errors.password}</p>}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="passwordConfirmation">Potwierdź hasło</Label>
								<Input id="passwordConfirmation" name="passwordConfirmation" type="password" required />
								{state?.errors?.passwordConfirmation && (
									<p className="text-red-600">{state.errors.passwordConfirmation}</p>
								)}
							</div>
							<Button type="submit" disabled={pending} className="w-full">
								Zarejestruj się
							</Button>
							{state?.message && <p className="text-red-600">{state.message}</p>}
						</div>
						<div className="mt-6 text-center text-sm">
							Masz już konto?{" "}
							<a href="/login" className="underline underline-offset-4">
								Zaloguj się
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
