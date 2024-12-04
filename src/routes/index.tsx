import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="relative mx-auto flex h-full max-w-5xl select-none flex-col justify-center gap-8">
			<div className="flex items-center justify-center gap-24">
				<GameLink name="𝓒𝔃𝓪𝓻𝓷𝔂 𝓙𝓪𝓬𝓮𝓴" imgSrc="blackjack.png" link="/games/blackjack" alt="czarny jacek" />
				<GameLink name="𝓟𝓾𝓷𝓽𝓸 𝓫𝓪𝓷𝓬𝓸" imgSrc="baccarat.png" link="/games/puntoBanco" alt="baccarat" />
				<GameLink name="𝓙𝓮𝓭𝓷𝓸𝓻𝓮𝓴𝓲 𝓫𝓪𝓷𝓭𝔂𝓽𝓪" imgSrc="slots.png" link="/games/slots" alt="jednoreki bandyta" />
			</div>
			<Link
				to="/payout"
				className="block w-full rounded-xl border border-amber-400 bg-amber-400/50 p-2 text-center text-xl"
			>
				𝓦𝔂𝓹𝓵𝓪𝓽𝓪
			</Link>
		</div>
	);
}

interface GameLinkProps {
	name: string;
	imgSrc: string;
	alt: string;
	link: string;
}

function GameLink({ name, imgSrc, link, alt }: GameLinkProps) {
	return (
		<Link
			to={link}
			className="flex flex-1 flex-col items-center gap-4 rounded-xl border border-amber-400 bg-amber-400/50 p-2"
		>
			<img src={`/covers/${imgSrc}`} alt={alt} className="size-32" />
			<h1 className="text-xl">{name}</h1>
		</Link>
	);
}
