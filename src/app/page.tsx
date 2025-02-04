import { getSession } from "@/server/session";
import Image from "next/image";

export default async function Home() {
	const session = await getSession();
	if (!session) return;

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<h1 className="text-7xl font-black">Kasyno</h1>
			<Image src="/kasyno.gif" alt="Kasyno" width={512} height={512} />

			<p>Witaj ponownie, {session.username}</p>
		</div>
	);
}
