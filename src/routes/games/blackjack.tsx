import { Button } from "@/components/ui/button";
import { shuffleDeck } from "@/lib/random";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/games/blackjack")({
	component: Blackjack,
});

function Blackjack() {
	const deck = useMemo(shuffleDeck, []);

	const [dealerHand, setDealerHand] = useState<string[]>([]);
	const [playerHand, setPlayerHand] = useState<string[]>([]);

	const playerPoints = useMemo(() => playerHand.reduce((sum, card) => sum + getCardValue(card), 0), [playerHand]);
	const dealerPoints = useMemo(() => dealerHand.reduce((sum, card) => sum + getCardValue(card), 0), [dealerHand]);

	const [gameState, setGameState] = useState<
		"idle" | "dealing" | "player" | "dealer" | "playerBust" | "dealerBust" | "playerWon" | "dealerWon" | "push"
	>("dealing");

	const hit = () => {
		if (gameState !== "player") return;

		setPlayerHand([...playerHand, deck.shift()!]);
	};

	const stand = () => {
		if (gameState !== "player") return;

		setGameState("dealer");
	};

	useEffect(() => {
		if (gameState === "dealing") {
			setDealerHand([deck.shift()!, deck.shift()!]);
			setPlayerHand([deck.shift()!, deck.shift()!]);
			setGameState("player");
		} else if (gameState === "dealer") {
			// We need to also keep track of it locally because the useMemo does not update instantly
			let dealerPoints = dealerHand.reduce((sum, card) => sum + getCardValue(card), 0);
			while (dealerPoints < 17) {
				const card = deck.shift()!;
				setDealerHand([...dealerHand, card]);

				if (card.split("_")[0] === "ace" && dealerPoints + 11 > 21) dealerPoints += 1;
				else dealerPoints += getCardValue(card);
			}

			if (dealerPoints > 21) setGameState("dealerBust");
			else if (dealerPoints > playerPoints) setGameState("dealerWon");
			else if (dealerPoints < playerPoints) setGameState("playerWon");
			else setGameState("push");
		}
	}, [gameState]);

	useEffect(() => {
		if (playerPoints > 21) setGameState("playerBust");
	}, [playerPoints]);

	return (
		<div className="relative grid h-full select-none place-items-center">
			<div className="flex w-3/5 flex-col items-center gap-8 rounded-xl border border-amber-400 bg-amber-400/50 p-4">
				<span>{!(gameState === "dealing" || gameState === "player") && dealerPoints}</span>
				<div className="flex">
					{dealerHand.map((card, i) => {
						const isHidden = i === 0 && (gameState === "dealing" || gameState === "player");
						return <img src={`/cards/${isHidden ? "back" : card}.svg`} alt={card} width="110" />;
					})}
				</div>
				<div className="flex items-center gap-5">
					<Button
						className="bg-green-600 hover:bg-green-600/90"
						disabled={gameState !== "player"}
						onClick={() => hit()}
					>
						Hit
					</Button>
					<Button className="bg-red-600 hover:bg-red-600/90" disabled={gameState !== "player"} onClick={() => stand()}>
						Stand
					</Button>
				</div>
				<div className="flex">
					{playerHand.map((card) => {
						return <img src={`/cards/${card}.svg`} alt={card} width="110" />;
					})}
				</div>
				<span>{playerPoints}</span>
			</div>

			<span>{gameState}</span>
		</div>
	);
}

function getCardValue(card: string): number {
	const type = card.split("_")[0];
	if (type === "ace") return 11;
	if (["king", "queen", "jack"].includes(type)) return 10;
	return parseInt(type);
}
