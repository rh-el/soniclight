import { useState } from "react";
import { renameDrawing } from "../api/drawing";
import { USERNAME_KEY } from "../constants";
import { validateDrawingName } from "../utils/validation";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

export default function DrawingInformationsDialog({
	open,
	onOpenChange,
	drawingId,
	currentName,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	drawingId: string;
	currentName: string;
	onSaved: (name: string) => void;
}) {
	const [name, setName] = useState(currentName);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const handleOpenChange = (isOpen: boolean) => {
		onOpenChange(isOpen);
		setName(currentName);
		setError(null);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const validationError = validateDrawingName(name);
		if (validationError) {
			setError(validationError);
			return;
		}
		const username = localStorage.getItem(USERNAME_KEY);
		if (!username) {
			setError("Not logged in");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			const result = await renameDrawing(username, drawingId, name.trim());
			onSaved(result.name);
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to rename drawing");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="text-md text-foreground">
							edit drawing title
						</DialogTitle>
						<DialogDescription className="sr-only">
							Change the title of this drawing.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<Label className="text-foreground" htmlFor="name">
							title
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setError(null);
							}}
							aria-invalid={Boolean(error)}
							className="text-foreground"
						/>
						{error && (
							<p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
								{error}
							</p>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" className="text-foreground" variant="outline">
								cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={saving}>
							{saving ? (
								<>
									<Spinner /> saving...
								</>
							) : (
								"save title"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
