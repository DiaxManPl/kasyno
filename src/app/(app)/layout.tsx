import Link from "next/link";

import { MoveLeft, Gem, User } from "lucide-react";
import { getSession } from "@/server/session";
import TokensDisplay from "./tokensDisplay";
import { TokensProvider } from "@/lib/context/tokensContext";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const user = await getSession();
	if (!user) return null;

	return (
		<TokensProvider>
			<div className="flex h-screen flex-col">
				<nav className="flex h-8 items-center justify-between border-b border-primary bg-primary/70 p-2">
					<Link href="/" className="flex items-center gap-2">
						<MoveLeft />
						Powrót
					</Link>

					<div className="flex items-center gap-2">
						<User />
						<span>{user.username}</span>
					</div>
					<div className="flex items-center gap-2">
						<Gem />
						<span>
							<TokensDisplay />
						</span>
					</div>
				</nav>

				<div className="flex-1">{children}</div>
			</div>
		</TokensProvider>
	);
}
