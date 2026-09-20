import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, SquarePen } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import ShapeList from "./ShapeList";
import { useEditorStore } from "../state-management/editor";
import { USERNAME_KEY } from "../constants";
import DrawingInformationsDialog from "./DrawingInformationsDialog";

export default function LeftPanel({
	title: initialTitle,
	drawingId,
	readOnly = false,
}: {
	title: string;
	drawingId: string;
	readOnly?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const [title, setTitle] = useState(initialTitle);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const navigate = useNavigate();
	const hasShapes = useEditorStore((s) => s.shapes.length > 0);

	const goHome = () => {
		const username = localStorage.getItem(USERNAME_KEY);
		navigate(username ? `/${username}/home` : "/login");
	};

	return (
		<div className="flex w-64 flex-col gap-4 rounded-xl border border-border bg-background/90 p-3 text-foreground font-mono">
			<div className="flex items-center justify-between">
				<Button
					onClick={goHome}
					variant="ghost"
					size="icon"
					className="cursor-pointer"
				>
					<ArrowLeft />
				</Button>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					variant="ghost"
					size="icon"
					className="cursor-pointer"
				>
					{isOpen ? <ChevronUp /> : <ChevronDown />}
				</Button>
			</div>
			<div className="flex items-center justify-between">
				<h2 className="pl-2">{title}</h2>
				{!readOnly && (
					<Button
						onClick={() => setIsDialogOpen(true)}
						variant="ghost"
						size="icon"
						className="cursor-pointer"
					>
						<SquarePen size={16} className="cursor-pointer" />
					</Button>
				)}
			</div>
			<DrawingInformationsDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				drawingId={drawingId}
				currentName={title}
				onSaved={setTitle}
			/>
			{isOpen && hasShapes && (
				<>
					<Separator />
					<ShapeList readOnly={readOnly} />
				</>
			)}
		</div>
	);
}
