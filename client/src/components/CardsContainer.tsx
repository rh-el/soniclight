import type { Drawing } from "../types";
import CardComponent from "./CardComponent";

interface CardsContainerProps {
	username: string;
	drawings: Drawing[];
	onCreate: () => void;
}

export default function CardsContainer({
	username,
	drawings,
	onCreate,
}: CardsContainerProps) {
	return (
		<div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{drawings.map((drawing) => (
				<CardComponent
					key={drawing.id}
					drawingData={drawing}
					username={username}
				/>
			))}
			<CardComponent isEmpty onCreate={onCreate} />
		</div>
	);
}
