import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();

export default defineConfig({
	schema: "./src/server/db/schema.ts",
	dialect: "postgresql",
	out: "./drizzle",
	strict: true,
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_POSTGRES_URL!,
	},
});
