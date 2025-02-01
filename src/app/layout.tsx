import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Kasyno",
	description: "Made With <3 Bby Wiktor and Mikołaj",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pl">
			<body className={`antialiased dark`}>{children}</body>
		</html>
	);
}
