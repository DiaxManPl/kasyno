"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { getSession } from "../session";

// This is the most insecure shit I wrote ever. Life is too short to secure an app made for a school project
export async function alterTokens(amount: number) {
	const user = await getSession();
	if (!user) return null;

	return db
		.update(users)
		.set({ tokens: sql`${users.tokens} - ${Math.round(amount * -1)}` })
		.where(and(eq(users.id, user.id), gt(users.tokens, amount * -1)))
		.returning({ tokens: users.tokens })
		.then((rows) => rows[0].tokens);
}

export async function getTokens() {
	const user = await getSession();
	if (!user) return null;

	return db
		.selectDistinct({ tokens: users.tokens })
		.from(users)
		.where(eq(users.id, user.id))
		.then((rows) => rows[0].tokens);
}
