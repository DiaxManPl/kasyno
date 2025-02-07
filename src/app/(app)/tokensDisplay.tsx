"use client";

import { useTokens } from "@/lib/context/tokensContext";

export default function TokensDisplay() {
	const { tokens } = useTokens();

	return tokens;
}
