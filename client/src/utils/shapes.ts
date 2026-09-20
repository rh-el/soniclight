import type { Shape, ShapeType } from "../types";

export const CANVAS_SIZE = 1000;
export const DEFAULT_SIZE = 100;
export const MIN_SIZE = 40;
export const MAX_SIZE = 400;

export const SHAPE_TYPES: ShapeType[] = ["CIRCLE", "RECTANGLE", "TRIANGLE"];

export const COLORS = [
	{ name: "a", hex: "#BB342F" },
	{ name: "b", hex: "#E8B9AB" },
	{ name: "c", hex: "#A1E8AF" },
	{ name: "d", hex: "#124E78" },
	{ name: "e", hex: "#9381FF" },
];

export const colorHex = (name: string) =>
	COLORS.find((c) => c.name === name)?.hex ?? "#888";

export const shapeName = (shape: Pick<Shape, "type" | "color">) =>
	`${shape.type.toLowerCase()}_${shape.color}`;

// bounding box in logical units: rectangle is 2:1, circle and triangle are square.
export const shapeExtent = (type: ShapeType, size: number) => ({
	width: size,
	height: type === "RECTANGLE" ? size / 2 : size,
});

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export const MAX_ROTATION = 359;

export const canRotate = (type: ShapeType) => type !== "CIRCLE";

// keep the whole shape inside the canvas (including its rotated bounding box).
export const clampCenter = (
	type: ShapeType,
	size: number,
	x: number,
	y: number,
	rotation = 0,
) => {
	const { width, height } = shapeExtent(type, size);
	const rad = (rotation * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	// real vertices for triangle so invisible bouding box doesn't block the shape
	const points =
		type === "TRIANGLE"
			? [
					[0, -height / 2],
					[width / 2, height / 2],
					[-width / 2, height / 2],
				]
			: [
					[-width / 2, -height / 2],
					[width / 2, -height / 2],
					[width / 2, height / 2],
					[-width / 2, height / 2],
				];
	const xs = points.map(([px, py]) => px * cos - py * sin);
	const ys = points.map(([px, py]) => px * sin + py * cos);

	return {
		x: clamp(x, -Math.min(...xs), CANVAS_SIZE - Math.max(...xs)),
		y: clamp(y, -Math.min(...ys), CANVAS_SIZE - Math.max(...ys)),
	};
};
