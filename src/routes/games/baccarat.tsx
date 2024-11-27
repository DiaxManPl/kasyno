import ShinyButton from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { shuffleDeck } from "@/lib/random";
import { useMoneyStore } from "@/lib/store/moneyStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/games/baccarat")({
	component: Baccarat,
});

type GameState = "idle" | "dealing" | "playerWon" | "dealerWon" | "tie";

const gameStateText: Record<GameState, string> = {
	idle: "Oczekiwanie",
	dealing: "Rozdawanie kart",
	playerWon: "Wygrywa Gracz",
	dealerWon: "Wygrywa Bank",
	tie: "Remis",
};

function Baccarat() {
	const deck = useMemo(shuffleDeck, []);

	const [dealerHand, setDealerHand] = useState<string[]>([]);
	const [playerHand, setPlayerHand] = useState<string[]>([]);

	const playerPoints = useMemo(() => playerHand.reduce((sum, card) => sum + getCardValue(card), 0), [playerHand]);
	const dealerPoints = useMemo(() => dealerHand.reduce((sum, card) => sum + getCardValue(card), 0), [dealerHand]);

	const [gameState, setGameState] = useState<GameState>("idle");

	const { money, setMoney } = useMoneyStore();

	const [betAmount, setBetAmount] = useState<number>(1);

	const startGame = () => {
		if (betAmount > money || betAmount < 1) return;

		setMoney((prev) => prev - betAmount);
		setGameState("dealing");
	};

	const restartGame = () => {
		setDealerHand([]);
		setPlayerHand([]);
		setGameState("idle");
	};

	const bet = (type: "player" | "dealer" | "tie") => {};
	return (
		<div className="relative grid h-full select-none place-items-center">
			<div className="flex w-3/5 flex-col items-center gap-8 rounded-xl border border-amber-400 bg-amber-400/50 p-4">
				<span className="h-2">{!(gameState === "idle") && dealerPoints}</span>
				<div className="flex">
					{dealerHand.map((card, i) => {
						return <img key={i} src={`/cards/${card}.svg`} alt={card} width="110" />;
					})}
				</div>
				<div className="flex items-center gap-5">
					{gameState === "idle" && (
						<div className="flex flex-col gap-2">
							<div className="flex w-full gap-2">
								<button className="size-16 rounded-full bg-amber-400" onClick={() => bet("player")}>
									Gracz
								</button>
								<button className="size-16 rounded-full bg-amber-400" onClick={() => bet("tie")}>
									Remis
								</button>
								<button className="size-16 rounded-full bg-amber-400" onClick={() => bet("dealer")}>
									Bank
								</button>
							</div>
							<Input
								type="number"
								min={1}
								max={money}
								value={betAmount}
								onChange={(e) => setBetAmount(parseInt(e.target.value))}
							/>
						</div>
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

function getCardValue(card: string): number {
	const type = card.split("_")[0];
	if (type === "ace") return 1;
	if (["king", "queen", "jack"].includes(type)) return 0;
	return parseInt(type);
}
