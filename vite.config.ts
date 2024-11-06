import { defineConfig } from "vite";
import { TanStackRouterVite as tanStackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tanStackRouter(), react()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
