import { useLoaderData } from "react-router-dom";
import type { Drawing } from "../types";

export default function Draw() {
	const drawing = useLoaderData() as Drawing;

	return (
		<div className="w-full h-dvh flex flex-col items-center justify-center overflow-hidden bg-background">
			<div className="flex flex-col w-full h-full max-w-338 py-10 px-10 gap-6">
				<h1 className="font-bold font-mono tracking-tight text-4xl md:text-5xl text-foreground">
					{drawing.name}
				</h1>
			</div>
		</div>
	);
}
