import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import CardsContainer from "../components/CardsContainer";
import type { DrawingsResponse } from "../types";

export default function Home() {
	const navigate = useNavigate();
	const { username, drawings } = useLoaderData() as DrawingsResponse;

	return (
		<div className="w-full h-dvh flex flex-col items-center justify-center overflow-hidden bg-background">
			<div className="flex flex-col w-full h-full max-w-338 items-center py-10 px-10 gap-6">
				<div className="flex flex-row items-center justify-between w-full">
					<h1 className="font-bold font-mono tracking-tight text-4xl md:text-5xl text-foreground">
						drawings
					</h1>
					<Button
						className="w-24 font-mono transition-colors cursor-pointer py-4 h-full"
						onClick={() => navigate("/new-work")}
					>
						create
					</Button>
				</div>
				<CardsContainer username={username} drawings={drawings} />
			</div>
		</div>
	);
}
