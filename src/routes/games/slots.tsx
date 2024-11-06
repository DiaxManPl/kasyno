import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { randomNumber } from "../../lib/random";
import { arrayAt } from "../../lib/array";

import ShinyButton from "@/components/magicui/shiny-button";
import { useMoneyStore } from "@/lib/store/moneyStore";

export const Route = createFileRoute("/games/slots")({
	component: Slots,
});

const SLOT_ICONS = ["🍊", "🍒", "⚜", "🍉", "🐔"];

const randomSlot = () => randomNumber(0, 5);

function Slots() {
	const [slots, setSlots] = useState<[number, number, number]>([0, 0, 0]);
	const [isSpinning, setIsSpinning] = useState(false);
	const [isCooldown, setIsCooldown] = useState(false);

	const { setMoney } = useMoneyStore();

	useEffect(() => {
		let interval: number;
		let timeout: number;

		if (isSpinning) {
			setIsCooldown(true);

			interval = setInterval(() => {
				setSlots([randomSlot(), randomSlot(), randomSlot()]);
			}, 100);

			timeout = setTimeout(() => setIsCooldown(false), 2000);
		}

		if (!isSpinning) {
			const [a, b, c] = slots;
			if (a === b && b === c) setMoney((prev) => prev + 100);
		}

		return () => {
			if (interval) clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [isSpinning]);

	return (
		<div className="grid h-full place-items-center">
			<div className="flex w-44 flex-col items-center gap-8 rounded-xl border border-amber-400 bg-amber-400/50 p-4">
				<div>
					<div className="flex items-center gap-2">
						{slots.map((slot, i) => (
							<span className="grid size-10 place-content-center border border-black bg-orange-300 text-xl" key={i}>
								{arrayAt(SLOT_ICONS, slot - 1)}
							</span>
						))}
					</div>
					<div className="flex items-center gap-2">
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
				<ShinyButton disabled={isCooldown} className="w-full" onClick={() => setIsSpinning((prev) => !prev)}>
					{isSpinning ? "Stop" : "Start"}
				</ShinyButton>
			</div>
		</div>
	);
}
