import Image from "next/image";

export default function Home() {
	return (
		<div className="w-full h-screen flex flex-col items-center justify-center">
			<h1 className="text-7xl font-black">Kasyno</h1>
			<Image src="/kasyno.gif" alt="Kasyno" width={512} height={512} />
		</div>
	);
}
