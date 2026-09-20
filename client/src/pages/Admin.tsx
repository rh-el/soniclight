import { useLoaderData } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import type { AdminDrawingsResponse } from "../types";

export default function Admin() {
	const { drawings } = useLoaderData() as AdminDrawingsResponse;

	return (
		<div className="w-full h-full flex flex-col items-center overflow-hidden bg-background">
			<div className="flex flex-col w-full h-full max-w-338 items-center py-10 px-10 gap-6">
				<h1 className="w-full font-bold font-mono tracking-tight text-4xl md:text-5xl text-foreground">
					admin
				</h1>
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
					{drawings.map((drawing) => (
						<CardComponent
							key={drawing.id}
							drawingData={drawing}
							ownerUsername={drawing.ownerUsername}
							shapeCount={drawing.shapeCount}
							readOnly
						/>
					))}
				</div>
			</div>
		</div>
	);
}
