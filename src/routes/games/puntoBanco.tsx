import ShinyButton from "@/components/magicui/shiny-button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { shuffleDeck } from "@/lib/random";
import { useMoneyStore } from "@/lib/store/moneyStore";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/games/puntoBanco")({
	component: Baccarat,
});

type GameState = "idle" | "playerWon" | "dealerWon" | "tie";

const gameStateText: Record<GameState, string> = {
	idle: "Oczekiwanie",
	playerWon: "Wygrywa Gracz",
	dealerWon: "Wygrywa Bank",
	tie: "Remis",
};

function Baccarat() {
	const deck = useMemo(shuffleDeck, []);

	const [dealerHand, setDealerHand] = useState<string[]>([]);
	const [playerHand, setPlayerHand] = useState<string[]>([]);

	const playerPoints = useMemo(() => playerHand.reduce((sum, card) => sum + getCardValue(card), 0) % 10, [playerHand]);
	const dealerPoints = useMemo(() => dealerHand.reduce((sum, card) => sum + getCardValue(card), 0) % 10, [dealerHand]);

	const [gameState, setGameState] = useState<GameState>("idle");

	const { money, setMoney } = useMoneyStore();

	const [betAmount, setBetAmount] = useState<number>(1);

	const restartGame = () => {
		setDealerHand([]);
		setPlayerHand([]);
		setGameState("idle");
	};

	const bet = (type: "player" | "dealer" | "tie") => {
		if (betAmount > money || betAmount < 1) return;
		setMoney((prev) => prev - betAmount);

		const dealerHandLocal = [deck.pop()!, deck.pop()!];
		const playerHandLocal = [deck.pop()!, deck.pop()!];

		setDealerHand(dealerHandLocal);
		setPlayerHand(playerHandLocal);

		const playerPointsLocal = playerHandLocal.reduce((sum, card) => sum + getCardValue(card), 0) % 10;
		const dealerPointsLocal = dealerHandLocal.reduce((sum, card) => sum + getCardValue(card), 0) % 10;

		if (playerPointsLocal > dealerPointsLocal) {
			setGameState("playerWon");
			if (type === "player") setMoney((prev) => prev + betAmount * 1.95);
		} else if (playerPointsLocal < dealerPointsLocal) {
			setGameState("dealerWon");
			if (type === "dealer") setMoney((prev) => prev + betAmount * 2);
		} else {
			setGameState("tie");
			if (type === "tie") setMoney((prev) => prev + betAmount * 9);
		}
	};
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
					{["playerWon", "dealerWon", "tie"].includes(gameState) && (
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
					<DialogTitle>Jak grać w Punto Banco?</DialogTitle>

					<p>
						Celem gry jest poprawne obstawienie tego, kto wygra (gracz, bank, czy remis). Na początku gry do wyboru są
						trzy zakłady. Wygrana gracza, wygrana banku lub remis.
					</p>
					<p>Bank i gracz dostają po dwie karty. Strona, która jest bliżej 9 wygrywa.</p>
					<p>Jeżeli liczba oczek przekroczy 9, wynik to liczba oczek po odjęciu 9.</p>
					<p>
						Kursy:
						<br />
						Bank: 1 : 1.95
						<br />
						Gracz: 1 : 2
						<br />
						Remis: 1 : 9
					</p>
					<p>
						Wartości kart:
						<br />
						As: 1
						<br />
						Król, Dama, Jopek, dziesiątka: 0
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
