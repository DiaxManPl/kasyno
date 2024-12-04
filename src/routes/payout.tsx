import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useHover } from "usehooks-ts";

export const Route = createFileRoute("/payout")({
	component: Payout,
});

function Payout() {
	const [x, setX] = useState(50);
	const [y, setY] = useState(50);

	const btnRef = useRef(null);
	const isHover = useHover(btnRef);

	useEffect(() => {
		if (isHover) {
			setX(Math.random() * 100);
			setY(Math.random() * 100);
		}
	}, [isHover]);

	return (
		<div className="relative h-full overflow-hidden">
			<a
				ref={btnRef}
				href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				target="_blank"
				className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-xl bg-amber-400 p-4"
				style={{ left: x + "%", top: y + "%" }}
			>
				Wypłać kasę
			</a>
		</div>
	);
}
