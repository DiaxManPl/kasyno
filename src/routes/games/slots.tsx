import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { randomNumber } from "../../lib/random";
import { arrayAt } from "../../lib/array";

import ShinyButton from "@/components/magicui/shiny-button";
import { useMoneyStore } from "@/lib/store/moneyStore";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import clsx from "clsx";

export const Route = createFileRoute("/games/slots")({
	component: Slots,
});

const SLOT_ICONS = ["🍊", "🍒", "⚜", "🍉", "🐔"];

const randomSlot = () => randomNumber(0, 5);

function Slots() {
	const [slots, setSlots] = useState<[number, number, number]>([0, 0, 0]);
	const [spinningInterval, setSpinningInterval] = useState<number | null>(null);
	const [isDisabled, setisDisabled] = useState(false);
	const [isWinAnimationActive, setisWinAnimationActive] = useState(false);

	const { money, setMoney } = useMoneyStore();

	useEffect(() => {
		if (money < 5) setisDisabled(true);
	}, [money, spinningInterval]);

	const handleBtnClick = () => {
		if (isDisabled) return;

		if (spinningInterval === null) {
			setisWinAnimationActive(false);

			setMoney((m) => m - 5);

			setisDisabled(true);
			setTimeout(() => {
				setisDisabled(false);
			}, 2000);

			setSpinningInterval(
				setInterval(() => {
					setSlots([randomSlot(), randomSlot(), randomSlot()]);
				}, 100),
			);
		} else {
			clearInterval(spinningInterval);
			setSpinningInterval(null);

			const [a, b, c] = slots;
			if (a == b && b == c) {
				setisWinAnimationActive(true);
				if (a === 0 || a === 4) setMoney((m) => m + 100);
				else if (a === 1 || a === 3) setMoney((m) => m + 200);
				else setMoney((m) => m + 500);
			}
		}
	};

	return (
		<div className="relative grid h-full select-none place-items-center">
			<div className="flex w-44 flex-col items-center gap-8 rounded-xl border border-amber-400 bg-amber-400/50 p-4">
				<div>
					<div className="flex items-center gap-2">
						{slots.map((slot, i) => (
							<span className="grid size-10 place-content-center border border-black bg-orange-300 text-xl" key={i}>
								{arrayAt(SLOT_ICONS, slot - 1)}
							</span>
						))}
					</div>
					<div
						className={clsx("flex items-center gap-2", {
							"animate-zoom": isWinAnimationActive,
						})}
					>
						{slots.map((slot, i) => (
							<span className="grid size-10 place-content-center border border-black bg-orange-300 text-xl" key={i}>
								{arrayAt(SLOT_ICONS, slot)}
							</span>
						))}
					</div>
					<div className="flex items-center gap-2">
						{slots.map((slot, i) => (
							<span className="grid size-10 place-content-center border border-black bg-orange-300 text-xl" key={i}>
								{arrayAt(SLOT_ICONS, slot + 1)}
							</span>
						))}
					</div>
				</div>
				<ShinyButton disabled={isDisabled} className="w-full" onClick={() => handleBtnClick()}>
					{spinningInterval === null ? "Start" : "Stop"}
				</ShinyButton>
			</div>

			<Dialog>
				<DialogTrigger>
					<span className="absolute right-4 top-4 flex size-16 items-center justify-center rounded-md border-amber-400 bg-amber-400/50 text-2xl">
						?
					</span>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Jak grać w Jednorękiego bandytę?</DialogTitle>

					<p>Dopasuj 3 ikony, ażeby osiągnąć wygraną!</p>
					<p>🍊🍊🍊: 100</p>
					<p>🐔🐔🐔: 100</p>
					<p>🍒🍒🍒: 200</p>
					<p>🍉🍉🍉: 200</p>
					<p>⚜⚜⚜: 500</p>

					<DialogClose asChild>
						<ShinyButton className="w-full">Zrozumiałem</ShinyButton>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	);
}
