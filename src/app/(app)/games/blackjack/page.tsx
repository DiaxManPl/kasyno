"use client";

import ShinyButton from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTokens } from "@/lib/context/tokensContext";
import { shuffleDeck } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type GameState =
	| "idle"
	| "dealing"
	| "player"
	| "dealer"
	| "playerBust"
	| "dealerBust"
	| "playerWon"
	| "playerBlackjack"
	| "dealerWon"
	| "push";

const gameStateText: Record<GameState, string> = {
	idle: "Oczekiwanie",
	dealing: "Rozdawanie kart",
	player: "Twój ruch",
	dealer: "Ruch krupiera",
	playerBust: "Przegrałeś (przekroczyłeś 21)",
	playerBlackjack: "Czarny Jacek!",
	dealerBust: "Wygrałeś (krupier przekroczył 21)",
	playerWon: "Wygrałeś",
	dealerWon: "Przegrałeś",
	push: "Remis",
};

export default function Blackjack() {
	const deck = useMemo(shuffleDeck, []);

	const [dealerHand, setDealerHand] = useState<string[]>([]);
	const [playerHand, setPlayerHand] = useState<string[]>([]);

	const playerPoints = useMemo(() => playerHand.reduce((sum, card) => sum + getCardValue(card, sum), 0), [playerHand]);
	const dealerPoints = useMemo(() => dealerHand.reduce((sum, card) => sum + getCardValue(card, sum), 0), [dealerHand]);

	const [gameState, setGameState] = useState<GameState>("idle");

	const { tokens, alterTokens } = useTokens();

	const [betAmount, setBetAmount] = useState<number>(1);

	const startGame = () => {
		if (betAmount > tokens || betAmount < 1) return;

		alterTokens(-betAmount);
		setGameState("dealing");
	};

	const restartGame = () => {
		setDealerHand([]);
		setPlayerHand([]);
		setGameState("idle");
	};

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
			const newPlayerHand = [deck.shift()!, deck.shift()!];
			setPlayerHand(newPlayerHand);
			if (newPlayerHand.reduce((sum, card) => sum + getCardValue(card, sum), 0) === 21) {
				setGameState("playerBlackjack");
			} else setGameState("player");
		} else if (gameState === "dealer") {
			// We need to also keep track of it locally because the useMemo does not update instantly
			let dealerPointsLocal = dealerPoints;
			while (dealerPointsLocal < 17) {
				const card = deck.shift()!;
				setDealerHand([...dealerHand, card]);
				dealerPointsLocal += getCardValue(card, dealerPointsLocal);
			}
			if (dealerPointsLocal > 21) setGameState("dealerBust");
			else if (dealerPointsLocal > playerPoints) setGameState("dealerWon");
			else if (dealerPointsLocal < playerPoints) setGameState("playerWon");
			else setGameState("push");
		} else if (gameState === "dealerBust" || gameState === "playerWon") {
			alterTokens(betAmount * 2);
		} else if (gameState === "playerBlackjack") {
			alterTokens(betAmount * 2.5);
		} else if (gameState === "push") {
			alterTokens(betAmount);
		}
	}, [gameState]);

	useEffect(() => {
		if (playerPoints > 21) setGameState("playerBust");
	}, [playerPoints]);

	return (
		<div className="relative grid h-full select-none place-items-center">
			<div className="flex w-3/5 flex-col items-center gap-8 rounded-xl border border-amber-400 bg-amber-400/50 p-4">
				<span className="h-2">
					{!(gameState === "dealing" || gameState === "player" || gameState === "idle") && dealerPoints}
				</span>
				<div className="flex">
					{dealerHand.map((card, i) => {
						const isHidden = i === 0 && (gameState === "dealing" || gameState === "player");
						return <img key={i} src={`/cards/${isHidden ? "back" : card}.svg`} alt={card} width="110" />;
					})}
				</div>
				<div className="flex items-center gap-5">
					{gameState === "idle" && (
						<>
							<Input
								type="number"
								min={1}
								max={tokens}
								value={betAmount}
								onChange={(e) => setBetAmount(parseInt(e.target.value))}
							/>
							<ShinyButton onClick={() => startGame()}>Graj</ShinyButton>
						</>
					)}
					{gameState === "player" && (
						<>
							<Button
								className="bg-green-600 hover:bg-green-600/90"
								disabled={gameState !== "player"}
								onClick={() => hit()}
							>
								Hit
							</Button>
							<Button
								className="bg-red-600 hover:bg-red-600/90"
								disabled={gameState !== "player"}
								onClick={() => stand()}
							>
								Stand
							</Button>
						</>
					)}
					{["playerBust", "dealerBust", "playerWon", "playerBlackjack", "dealerWon", "push"].includes(gameState) && (
						<>
							<span>{gameStateText[gameState]}</span>
							<ShinyButton onClick={() => restartGame()}>Zagraj ponownie</ShinyButton>
						</>
					)}
				</div>
				<div className="flex">
					{playerHand.map((card, i) => {
						return <img key={i} src={`/cards/${card}.svg`} alt={card} width="110" />;
					})}
				</div>
				<span className="h-2">{gameState !== "idle" && playerPoints}</span>
			</div>

			<Dialog>
				<DialogTrigger>
					<span className="absolute right-4 top-4 flex size-16 items-center justify-center rounded-md border-amber-400 bg-amber-400/50 text-2xl">
						?
					</span>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Jak grać w Czarnego Jacka?</DialogTitle>

					<p>
						Na początku gry ty i krupier dostajecie po dwie karty. Do czasu tury krupiera, widzisz tylko jedną jego
						kartę.
					</p>
					<p>Celem gry jest osiągnięcie liczby oczek jak najbliżej 21, ale nie przekraczającej.</p>
					<p>
						Gdy nadejdzie twoja tura, masz do wyboru dwie opjce: hit lub stand. Jeśli wybierzesz hit, dobierzesz jeszcze
						jedną kartę, a jej wartośc doda się do sumy oczek. Jeśli wybierzesz stand, następuje tura krupiera.
					</p>
					<p>Krupier dobiera karty, aż do momentu uzyskania 17 oczek lub wiecej.</p>
					<p>
						Wygrywasz ty, jeśli masz więcej oczek niż krupier i nie przekraczasz 21, lub kiedy krupier przekroczył 21
						oczek. Wygrywa krupier, jeśli masz mniej oczek niż on lub przekraczasz 21.
					</p>

					<p>
						Wartości kart:
						<br />
						As: 1 lub 11 w zależności od tego, czy przekroczysz 21
						<br />
						Król, Dama, Jopek: 10
						<br />
						Pozostałe: ich wartość
					</p>
					<DialogClose asChild>
						<ShinyButton className="w-full">Zrozumiałem</ShinyButton>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function getCardValue(card: string, handValue: number): number {
	const type = card.split("_")[0];
	if (type === "ace") return handValue + 11 > 21 ? 1 : 11;
	if (["king", "queen", "jack"].includes(type)) return 10;
	return parseInt(type);
}
