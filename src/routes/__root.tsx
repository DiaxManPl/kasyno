import { useMoneyStore } from "@/lib/store/moneyStore";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Gem, MoveLeft } from "lucide-react";

export const Route = createRootRoute({
	component: () => {
		const { money } = useMoneyStore();

		return (
			<div className="flex h-screen flex-col">
				<nav className="flex h-8 items-center border-b border-amber-400 bg-amber-400/70 p-2">
					<Link to="/" className="flex items-center gap-2">
						<MoveLeft />
						Powrót
					</Link>

					<div className="ml-auto flex items-center gap-2">
						<span>{money}</span>
						<Gem />
					</div>
				</nav>

				<div className="flex-1">
					<Outlet />
				</div>
				<TanStackRouterDevtools />
			</div>
		);
	},
});
