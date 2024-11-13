import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games/blackjack")({
	component: Blackjack,
});

function Blackjack() {
	return <img src="/cards/back.svg" />;
}
