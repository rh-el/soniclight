import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import type { Drawing } from "../types";
import Canvas from "../components/Canvas";
import LeftPanel from "../components/LeftPanel";
import Toolbox from "../components/Toolbox";
import { useEditorStore } from "../state-management/editor";
import SaveButton from "../components/SaveButton";

export default function Draw() {
	const drawing = useLoaderData() as Drawing;

	useEffect(() => {
		useEditorStore.getState().load(drawing.shapes);
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				useEditorStore.getState().cancel();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			useEditorStore.getState().reset();
		};
	}, [drawing.id, drawing.shapes]);

	return (
		<div className="relative h-dvh w-full overflow-hidden bg-background">
			<Canvas />
			<div className="absolute left-4 top-4">
				<LeftPanel title={drawing.name} drawingId={drawing.id} />
			</div>
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2">
				<Toolbox />
			</div>
			<div className="absolute top-2 flex flex-col items-end gap-2 right-2">
				<SaveButton drawingId={drawing.id} />
			</div>
		</div>
	);
}
