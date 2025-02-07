"use client";

import { getTokens } from "@/server/actions/tokens";
import { createContext, useContext, useEffect, useState } from "react";
import { alterTokens as alterTokensAction } from "@/server/actions/tokens";

export const TokensContext = createContext({
	tokens: 0,
	alterTokens: (amount: number) => {},
} as { tokens: number; alterTokens: (amount: number) => void });

export function TokensProvider({ children }: { children: React.ReactNode }) {
	const [tokens, setTokens] = useState(0);

	useEffect(() => {
		getTokens().then((tokens) => {
			if (!tokens) return;
			setTokens(tokens);
		});
	}, []);

	const alterTokens = async (amount: number) => {
		const newTokens = await alterTokensAction(amount);
		if (!newTokens) return;
		setTokens(newTokens);
	};

	return <TokensContext.Provider value={{ tokens, alterTokens }}>{children}</TokensContext.Provider>;
}

export const useTokens = () => {
	return useContext(TokensContext);
};
