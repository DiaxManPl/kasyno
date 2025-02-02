import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Kasyno",
	description: "Made With <3 by Wiktor and Mikołaj",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pl">
			<body className={`dark antialiased`}>{children}</body>
		</html>
	);
}
