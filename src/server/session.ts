import "server-only";

import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const key = new TextEncoder().encode(process.env.AUTH_SECRET!);
const alg = "HS256";

export async function encprypt(payload: SessionPayload) {
	return new SignJWT(payload).setProtectedHeader({ alg }).setIssuedAt().setExpirationTime("7d").sign(key);
}

export async function decrypt(session: string) {
	try {
		const { payload } = await jwtVerify(session, key, { algorithms: [alg] });
		return payload as SessionPayload;
	} catch {
		return null;
	}
}

export async function createSession(data: SessionData) {
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await encprypt(data as SessionPayload);

	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		expires,
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}

export async function getSession(redirectToLogin = true) {
	const cookieStore = await cookies();
	const cookie = cookieStore.get("session");
	if (!cookie) return redirectToLogin ? redirect("/login") : null;

	const session = await decrypt(cookie.value);
	if (!session) {
		cookieStore.delete("session"); // Remove invalid cookie
		return redirectToLogin ? redirect("/login") : null;
	}

	return session;
}

interface SessionData {
	id: number;
	username: string;
}

type SessionPayload = JWTPayload & SessionData;
