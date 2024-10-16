import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { randomChoice } from "../../lib/random";
import { arrayAt } from "../../lib/array";

export const Route = createFileRoute("/games/slots")({
	component: Slots,
});

const SLOT_ICONS = ["🍊", "🍒", "⚜", "🍉", "🐔"];

const randomSlot = () => randomChoice(SLOT_ICONS);

function Slots() {
	const [slots, setSlots] = useState<[number, number, number]>([0, 0, 5]);

	return (
		<div>
			<div>
				{slots.map((slot) => (
					<span>{arrayAt(SLOT_ICONS, slot - 1)}</span>
				))}
			</div>
			<div>
				{slots.map((slot) => (
					<span>{SLOT_ICONS[slot]}</span>
				))}
			</div>
			<div>
				{slots.map((slot) => (
					<span>{arrayAt(SLOT_ICONS, slot + 1)}</span>
				))}
			</div>
		</div>
	);
}
