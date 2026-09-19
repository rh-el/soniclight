import { useState } from "react";
import { saveDrawingShapes } from "../api/drawing";
import { USERNAME_KEY } from "../constants";
import { useEditorStore } from "../state-management/editor";
import { Button } from "./ui/button";

export default function SaveButton({ drawingId }: { drawingId: string }) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSaveComposition = async () => {
		const username = localStorage.getItem(USERNAME_KEY);
		if (!username) {
			setError("Not logged in");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			await saveDrawingShapes(
				username,
				drawingId,
				useEditorStore.getState().shapes,
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save drawing");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Button
				onClick={handleSaveComposition}
				disabled={saving}
				className="rounded-xl px-4 py-6"
			>
				{saving ? "saving..." : "save"}
			</Button>
			{error && (
				<span className="text-xs text-red-400 max-w-50 text-right">
					{error}
				</span>
			)}
		</>
	);
}
