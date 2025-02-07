"use client";

import { useEffect, useRef, useState } from "react";
import { useHover } from "usehooks-ts";

export default function Payout() {
	const [x, setX] = useState(50);
	const [y, setY] = useState(50);

	const btnRef = useRef(null);
	// @ts-expect-error React 19 type compatibility, nullable ref can be ignored
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
				className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-xl bg-primary p-4 text-primary-foreground"
				style={{ left: x + "%", top: y + "%" }}
			>
				Wypłać kasę
			</a>
		</div>
	);
}
