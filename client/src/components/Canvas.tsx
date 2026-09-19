import { useRef, useState, type PointerEvent } from "react";
import { useEditorStore } from "../state-management/editor";
import type { ShapeType } from "../types";
import {
	CANVAS_SIZE,
	clampCenter,
	colorHex,
	shapeExtent,
} from "../utils/shapes";

function ShapeGraphic({
	type,
	size,
	x,
	y,
	color,
	rotation = 0,
	...props
}: {
	type: ShapeType;
	size: number;
	x: number;
	y: number;
	color: string;
	rotation?: number;
} & React.SVGProps<SVGElement>) {
	const fill = colorHex(color);
	const { width, height } = shapeExtent(type, size);
	const common = {
		fill,
		transform: rotation ? `rotate(${rotation} ${x} ${y})` : undefined,
		...(props as object),
	};
	if (type === "CIRCLE")
		return <circle cx={x} cy={y} r={size / 2} {...common} />;
	if (type === "RECTANGLE")
		return (
			<rect
				x={x - width / 2}
				y={y - height / 2}
				width={width}
				height={height}
				{...common}
			/>
		);
	const points = `${x},${y - height / 2} ${x + width / 2},${y + height / 2} ${x - width / 2},${y + height / 2}`;
	return <polygon points={points} {...common} />;
}

export default function Canvas() {
	const svgRef = useRef<SVGSVGElement>(null);
	const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
	const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

	const shapes = useEditorStore((s) => s.shapes);
	const mode = useEditorStore((s) => s.mode);
	const pendingType = useEditorStore((s) => s.pendingType);
	const pendingColor = useEditorStore((s) => s.pendingColor);
	const selectedId = useEditorStore((s) => s.selectedId);
	const place = useEditorStore((s) => s.place);
	const select = useEditorStore((s) => s.select);
	const moveShape = useEditorStore((s) => s.moveShape);
	const cancel = useEditorStore((s) => s.cancel);

	// Screen pixels -> logical canvas units.
	const toLogical = (e: PointerEvent) => {
		const svg = svgRef.current!;
		const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
			svg.getScreenCTM()!.inverse(),
		);
		return { x: point.x, y: point.y };
	};

	const handleBackgroundDown = (e: PointerEvent) => {
		const point = toLogical(e);
		if (mode === "color-selected") place(point.x, point.y);
		else cancel();
	};

	const handleShapeDown = (
		e: PointerEvent,
		id: string,
		x: number,
		y: number,
	) => {
		if (mode === "color-selected") return;
		e.stopPropagation();
		const point = toLogical(e);
		select(id);
		dragRef.current = { id, dx: x - point.x, dy: y - point.y };
		svgRef.current!.setPointerCapture(e.pointerId);
	};

	const handleMove = (e: PointerEvent) => {
		const point = toLogical(e);
		setCursor(point);
		const drag = dragRef.current;
		if (drag) moveShape(drag.id, point.x + drag.dx, point.y + drag.dy);
	};

	const ghost =
		mode === "color-selected" && pendingType && pendingColor && cursor
			? {
					type: pendingType,
					color: pendingColor,
					...clampCenter(pendingType, 100, cursor.x, cursor.y),
				}
			: null;

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
			className="h-full w-full touch-none select-none"
			onPointerDown={handleBackgroundDown}
			onPointerMove={handleMove}
			onPointerUp={() => (dragRef.current = null)}
		>
			<rect
				width={CANVAS_SIZE}
				height={CANVAS_SIZE}
				className="fill-card stroke-border"
				strokeWidth={2}
			/>
			{[...shapes]
				.sort((a, b) => a.z - b.z)
				.map((shape) => (
					<ShapeGraphic
						key={shape.id}
						type={shape.type}
						color={shape.color}
						size={shape.size}
						rotation={shape.rotation}
						x={shape.positionX}
						y={shape.positionY}
						stroke={selectedId === shape.id ? "white" : "none"}
						strokeWidth={4}
						style={{ cursor: "pointer" }}
						onPointerDown={(e: PointerEvent) =>
							handleShapeDown(
								e,
								shape.id,
								shape.positionX,
								shape.positionY,
							)
						}
					/>
				))}
			{ghost && (
				<ShapeGraphic
					type={ghost.type}
					color={ghost.color}
					size={100}
					x={ghost.x}
					y={ghost.y}
					opacity={0.5}
					pointerEvents="none"
				/>
			)}
		</svg>
	);
}
