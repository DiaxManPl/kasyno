import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/server/session";
import { cookies } from "next/headers";

const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
	if (publicRoutes.includes(req.nextUrl.pathname)) return NextResponse.next();

	const cookie = (await cookies()).get("session")?.value;
	if (!cookie) return NextResponse.redirect(new URL("/login", req.nextUrl));

	const session = await decrypt(cookie);
	if (!session) return NextResponse.redirect(new URL("/login", req.nextUrl));
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
