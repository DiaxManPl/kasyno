"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/server/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
	const [state, action, pending] = useActionState(login, undefined);

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Witamy z powrotem</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="username">Nazwa użytkownika</Label>
								<Input id="username" name="username" type="text" required />
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="password">Hasło</Label>
								<Input id="password" name="password" type="password" required />
							</div>
							<Button type="submit" disabled={pending} className="w-full">
								Zaloguj się
							</Button>
							{state?.message && <p className="text-red-600">{state.message}</p>}
						</div>
						<div className="mt-6 text-center text-sm">
							Nie masz konta?{" "}
							<a href="/signup" className="underline underline-offset-4">
								Zarejestruj się
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
