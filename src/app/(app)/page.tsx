import { getSession } from "@/server/session";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
	const session = await getSession();
	if (!session) return;

	return (
		<div className="relative mx-auto flex h-full max-w-5xl select-none flex-col justify-center gap-8">
			<div className="flex items-center justify-center gap-24">
				<GameLink name="𝓒𝔃𝓪𝓻𝓷𝔂 𝓙𝓪𝓬𝓮𝓴" imgSrc="blackjack.png" link="/games/blackjack" alt="czarny jacek" />
				<GameLink name="𝓟𝓾𝓷𝓽𝓸 𝓫𝓪𝓷𝓬𝓸" imgSrc="baccarat.png" link="/games/puntoBanco" alt="baccarat" />
				<GameLink name="𝓙𝓮𝓭𝓷𝓸𝓻𝓮𝓴𝓲 𝓫𝓪𝓷𝓭𝔂𝓽𝓪" imgSrc="slots.png" link="/games/slots" alt="jednoreki bandyta" />
			</div>
			<Link
				href="/payout"
				className="block w-full rounded-xl border border-primary bg-primary/50 p-2 text-center text-xl"
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
			href={link}
			className="flex flex-1 flex-col items-center gap-4 rounded-xl border border-primary bg-primary/50 p-2"
		>
			<Image src={`/covers/${imgSrc}`} alt={alt} width={128} height={128} className="size-32" />
			<h1 className="text-xl">{name}</h1>
		</Link>
	);
}
