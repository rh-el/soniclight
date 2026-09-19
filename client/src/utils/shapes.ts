import type { EditorShape, ShapeType } from "../types";

export const CANVAS_SIZE = 1000;
export const DEFAULT_SIZE = 100;
export const MIN_SIZE = 40;
export const MAX_SIZE = 400;

export const SHAPE_TYPES: ShapeType[] = ["CIRCLE", "RECTANGLE", "TRIANGLE"];

export const COLORS = [
	{ name: "red", hex: "#ef4444" },
	{ name: "orange", hex: "#f97316" },
	{ name: "green", hex: "#22c55e" },
	{ name: "blue", hex: "#3b82f6" },
	{ name: "purple", hex: "#a855f7" },
];

export const colorHex = (name: string) => COLORS.find((c) => c.name === name)?.hex ?? "#888";

export const shapeName = (shape: Pick<EditorShape, "type" | "color">) =>
	`${shape.type.toLowerCase()}_${shape.color}`;

// Bounding box in logical units: rectangle is 2:1, circle and triangle are square.
export const shapeExtent = (type: ShapeType, size: number) => ({
	width: size,
	height: type === "RECTANGLE" ? size / 2 : size,
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const MAX_ROTATION = 359;

export const canRotate = (type: ShapeType) => type !== "CIRCLE";

// Keeps the whole shape (including its rotated bounding box) inside the canvas.
export const clampCenter = (
	type: ShapeType,
	size: number,
	x: number,
	y: number,
	rotation = 0,
) => {
	const { width, height } = shapeExtent(type, size);
	const rad = (rotation * Math.PI) / 180;
	const cos = Math.abs(Math.cos(rad));
	const sin = Math.abs(Math.sin(rad));
	const halfW = (width * cos + height * sin) / 2;
	const halfH = (width * sin + height * cos) / 2;
	return {
		x: clamp(x, halfW, CANVAS_SIZE - halfW),
		y: clamp(y, halfH, CANVAS_SIZE - halfH),
	};
};
