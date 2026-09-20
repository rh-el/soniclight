import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ISADMIN_KEY, USERNAME_KEY } from "../constants";
import { cn } from "../lib/utils";

const tabStyle = "rounded-md px-3 py-1.5 font-mono text-sm transition-colors";

export default function Layout() {
	// re-render on each navigation so the header follows the stored flag
	useLocation();
	const isAdmin = localStorage.getItem(ISADMIN_KEY) === "true";
	const username = localStorage.getItem(USERNAME_KEY);

	return (
		<div className="flex h-dvh w-full flex-col bg-background">
			{isAdmin && (
				<header className="flex w-full items-center gap-2 border-b border-border px-10 py-3">
					{[
						{ to: `/${username}/home`, label: "Drawings" },
						{ to: "/admin", label: "Admin" },
					].map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								cn(
									tabStyle,
									isActive
										? "bg-primary/20 text-primary-light"
										: "text-muted-foreground hover:text-foreground",
								)
							}
						>
							{label}
						</NavLink>
					))}
				</header>
			)}
			<div className="min-h-0 flex-1">
				<Outlet />
			</div>
		</div>
	);
}
