import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import ShapeList from "./ShapeList";
import { useEditorStore } from "../state-management/editor";
import { USERNAME_KEY } from "../constants";

export default function LeftPanel({ title }: { title: string }) {
	const [isOpen, setIsOpen] = useState(true);
	const navigate = useNavigate();
	const hasShapes = useEditorStore((s) => s.shapes.length > 0);

	const goHome = () => {
		const username = localStorage.getItem(USERNAME_KEY);
		navigate(username ? `/${username}/home` : "/login");
	};

	return (
		<div className="flex w-64 flex-col gap-4 rounded-lg border border-border bg-background/90 p-3 text-foreground font-mono">
			<div className="flex items-center justify-between">
				<Button onClick={goHome} variant="ghost" size="icon" className="cursor-pointer">
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
			<h2>{title}</h2>
			{isOpen && hasShapes && (
				<>
					<Separator />
					<ShapeList />
				</>
			)}
		</div>
	);
}
