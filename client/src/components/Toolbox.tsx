import { Circle, RectangleHorizontal, Trash2, Triangle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import { useEditorStore } from "../state-management/editor";
import type { ShapeType } from "../types";
import {
	COLORS,
	MAX_ROTATION,
	MAX_SIZE,
	MIN_SIZE,
	SHAPE_TYPES,
	canRotate,
} from "../utils/shapes";
import { Label } from "./ui/label";

const icons: Record<ShapeType, ReactNode> = {
	CIRCLE: <Circle />,
	RECTANGLE: <RectangleHorizontal />,
	TRIANGLE: <Triangle />,
};

const buttonBase = "aspect-square h-auto";

export default function Toolbox() {
	const shapes = useEditorStore((s) => s.shapes);
	const mode = useEditorStore((s) => s.mode);
	const pendingType = useEditorStore((s) => s.pendingType);
	const selectedId = useEditorStore((s) => s.selectedId);
	const chooseType = useEditorStore((s) => s.chooseType);
	const chooseColor = useEditorStore((s) => s.chooseColor);
	const cancel = useEditorStore((s) => s.cancel);
	const resizeShape = useEditorStore((s) => s.resizeShape);
	const rotateShape = useEditorStore((s) => s.rotateShape);
	const deleteSelected = useEditorStore((s) => s.deleteSelected);

	const selected = shapes.find((s) => s.id === selectedId);

	return (
		<div className="flex items-center gap-2 transition-width rounded-lg border border-border bg-background/90 p-2">
			{SHAPE_TYPES.map((type) => {
				const availableColors = COLORS.filter(
					(c) =>
						!shapes.some(
							(s) => s.type === type && s.color === c.name,
						),
				);
				const isActive = pendingType === type;
				return (
					<DropdownMenu
						key={type}
						open={mode === "shape-selected" && isActive}
						onOpenChange={(open) => {
							if (open) chooseType(type);
							else if (
								useEditorStore.getState().mode ===
								"shape-selected"
							)
								cancel();
						}}
					>
						<DropdownMenuTrigger asChild>
							<Button
								disabled={availableColors.length === 0}
								className={cn(
									buttonBase,
									isActive ? "bg-primary" : "bg-transparent",
								)}
							>
								{icons[type]}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{availableColors.map((c) => (
								<DropdownMenuItem
									key={c.name}
									onSelect={() => chooseColor(c.name)}
								>
									<span
										className="size-3 rounded-full"
										style={{ backgroundColor: c.hex }}
									/>
									{c.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			})}
			{mode === "shape-update" && selected && (
				<Slider
					className="w-40"
					title="Size"
					aria-label="Size"
					min={MIN_SIZE}
					max={MAX_SIZE}
					step={1}
					value={[selected.size]}
					onValueChange={([size]) => resizeShape(selected.id, size)}
				/>
			)}
			{mode === "shape-update" &&
				selected &&
				canRotate(selected.type) && (
					<Slider
						className="w-40"
						title="Rotation"
						aria-label="Rotation"
						min={0}
						max={MAX_ROTATION}
						step={1}
						value={[selected.rotation]}
						onValueChange={([rotation]) =>
							rotateShape(selected.id, rotation)
						}
					/>
				)}
			<Button
				disabled={mode !== "shape-update"}
				className={cn(buttonBase, "bg-transparent")}
				onClick={deleteSelected}
			>
				<Trash2 />
			</Button>
		</div>
	);
}
