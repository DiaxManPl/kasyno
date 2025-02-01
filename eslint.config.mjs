import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import tailwind from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	...tailwind.configs["flat/recommended"],
	prettier,

	{
		rules: {
			"tailwindcss/classnames-order": "off",
		}
	},
];