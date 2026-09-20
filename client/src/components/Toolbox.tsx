import { Circle, RectangleHorizontal, Trash2, Triangle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import { useEditorStore } from "../state-management/editor";
import type { ShapeType } from "../types";
import { COLORS, MAX_ROTATION, MAX_SIZE, MIN_SIZE, SHAPE_TYPES, canRotate } from "../utils/shapes";

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

	// only for sliders animation purpose
	const selected = shapes.find((s) => s.id === selectedId);
	const [lastSelected, setLastSelected] = useState(selected);
	if (selected && selected !== lastSelected) {
		setLastSelected(selected);
	}
	const sliderShape = selected ?? lastSelected;
	const isUpdating = mode === "shape-update" && !!selected;

	return (
		<div className="flex items-center gap-2 duration-300 transition-[width] rounded-lg border border-border bg-background/90 p-2">
			{SHAPE_TYPES.map((type) => {
				const availableColors = COLORS.filter(
					(c) => !shapes.some((s) => s.type === type && s.color === c.name),
				);
				const isActive = pendingType === type;
				return (
					<DropdownMenu
						key={type}
						open={mode === "shape-selected" && isActive}
						onOpenChange={(open) => {
							if (open) chooseType(type);
							else if (useEditorStore.getState().mode === "shape-selected") cancel();
						}}
					>
						<DropdownMenuTrigger asChild>
							<Button
								disabled={availableColors.length === 0}
								className={cn(
									buttonBase,
									"hover:bg-primary/50",
									isActive ? "bg-primary" : "bg-transparent",
								)}
							>
								{icons[type]}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="bg-background/90 border-border flex flex-col gap-2  p-2"
							align="center"
							sideOffset={10}
							style={{ minWidth: 0, width: "fit-content" }}
						>
							{availableColors.map((c) => (
								<DropdownMenuItem
									key={c.name}
									onSelect={() => chooseColor(c.name)}
									className="cursor-pointer w-9 h-9 focus:brightness-120"
									style={{ backgroundColor: c.hex }}
								>
									<span className="size-3 rounded-full" style={{ backgroundColor: c.hex }} />
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			})}
			<div
				aria-hidden={!isUpdating}
				className={cn(
					"flex items-center gap-2 overflow-hidden transition-all duration-300 ease-out h-4",
					isUpdating ? "max-w-96 opacity-100" : "pointer-events-none -mr-2 max-w-0 opacity-0",
				)}
			>
				{sliderShape && (
					<>
						<Slider
							className="w-40 shrink-0 cursor-pointer"
							title="Size"
							aria-label="Size"
							min={MIN_SIZE}
							max={MAX_SIZE}
							step={1}
							value={[sliderShape.size]}
							onValueChange={([size]) => resizeShape(sliderShape.id, size)}
						/>
						{canRotate(sliderShape.type) && (
							<Slider
								className="w-40 shrink-0 cursor-pointer"
								title="Rotation"
								aria-label="Rotation"
								min={0}
								max={MAX_ROTATION}
								step={1}
								value={[sliderShape.rotation]}
								onValueChange={([rotation]) => rotateShape(sliderShape.id, rotation)}
							/>
						)}
					</>
				)}
			</div>
			<Button
				disabled={mode !== "shape-update"}
				variant="destructive"
				className={cn(buttonBase, "bg-transparent hover:bg-destructive/50")}
				onClick={deleteSelected}
			>
				<Trash2 />
			</Button>
		</div>
	);
}
