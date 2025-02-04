import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import tailwind from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default tseslint.config(
	{
		ignores: [".next"],
	},

	// Base eslint
	eslint.configs.recommended,
	tseslint.configs.recommended,

	// Next.js & React
	...compat.extends("plugin:@next/next/recommended"),
	...compat.extends("plugin:react/recommended"),
	...compat.extends("plugin:react-hooks/recommended"),

	// Other plugins
	...tailwind.configs["flat/recommended"],
	prettier,

	// Settings
	{
		settings: {
			react: {
				version: "detect",
			},
			tailwindcss: {
				callees: ["clsx", "cn"],
			},
		},

		rules: {
			"react/react-in-jsx-scope": "off", // It's not 2017 anymore, why is this still on by default
			"tailwindcss/classnames-order": "off", // This is already handled by Prettier
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
);
