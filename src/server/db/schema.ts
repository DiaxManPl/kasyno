import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial().primaryKey(),
	username: text().unique().notNull(),
	password: text().notNull(),
	tokens: integer().default(1_000).notNull(),
});
