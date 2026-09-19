import { useEffect, useRef } from "react";
import p5 from "p5";
import { useEditorStore } from "../state-management/editor";
import type { EditorShape, ShapeType } from "../types";
import {
	CANVAS_SIZE,
	DEFAULT_SIZE,
	clampCenter,
	colorHex,
	shapeExtent,
} from "../utils/shapes";

type Drawable = Pick<EditorShape, "type" | "color" | "size" | "rotation"> & {
	x: number;
	y: number;
};

function drawShape(p: p5, shape: Drawable, alpha = 255) {
	const { width, height } = shapeExtent(shape.type, shape.size);
	const fill = p.color(colorHex(shape.color));
	fill.setAlpha(alpha);
	p.push();
	p.translate(shape.x, shape.y);
	p.rotate(p.radians(shape.rotation));
	p.fill(fill);

	if (shape.type === "CIRCLE") {
		p.circle(0, 0, shape.size);
	} else if (shape.type === "RECTANGLE") {
		p.rect(-width / 2, -height / 2, width, height);
	} else
		p.triangle(
			0,
			-height / 2,
			width / 2,
			height / 2,
			-width / 2,
			height / 2,
		);
	p.pop();
}

function hitTest(shape: EditorShape, px: number, py: number) {
	const rad = (-shape.rotation * Math.PI) / 180;
	const dx = px - shape.positionX;
	const dy = py - shape.positionY;
	const x = dx * Math.cos(rad) - dy * Math.sin(rad);
	const y = dx * Math.sin(rad) + dy * Math.cos(rad);
	const { width, height } = shapeExtent(shape.type, shape.size);

	if (shape.type === "CIRCLE") {
		return Math.hypot(x, y) <= shape.size / 2;
	}

	if (shape.type === "RECTANGLE") {
		return Math.abs(x) <= width / 2 && Math.abs(y) <= height / 2;
	}
	// triangle: apex at the top center, base along the bottom of the bounding box.
	if (Math.abs(y) > height / 2) {
		return false;
	}
	const halfAtY = ((y + height / 2) / height) * (width / 2);
	return Math.abs(x) <= halfAtY;
}

const topShapeAt = (x: number, y: number) =>
	[...useEditorStore.getState().shapes]
		.sort((a, b) => b.z - a.z)
		.find((s) => hitTest(s, x, y));

export default function Canvas() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current!;
		let drag: { id: string; dx: number; dy: number } | null = null;
		let scale = 1;
		let offsetX = 0;
		let offsetY = 0;

		const sketch = (p: p5) => {
			const layout = () => {
				const w = Math.max(1, container.clientWidth);
				const h = Math.max(1, container.clientHeight);
				scale = Math.min(w, h) / CANVAS_SIZE;
				offsetX = (w - CANVAS_SIZE * scale) / 2;
				offsetY = (h - CANVAS_SIZE * scale) / 2;
				return { w, h };
			};

			const toLogical = () => ({
				x: (p.mouseX - offsetX) / scale,
				y: (p.mouseY - offsetY) / scale,
			});

			const isOnCanvas = (e: Event) =>
				e.target ===
				(p as unknown as { canvas: HTMLCanvasElement }).canvas;

			p.setup = () => {
				const { w, h } = layout();
				const canvas = p.createCanvas(w, h);
				canvas.parent(container);
				canvas.elt.classList.add("bg-card", "touch-none");
				new ResizeObserver(() => {
					const { w, h } = layout();
					p.resizeCanvas(w, h);
				}).observe(container);
			};

			p.draw = () => {
				const { shapes, mode, pendingType, pendingColor, selectedId } =
					useEditorStore.getState();
				const cursor = toLogical();
				p.clear();
				p.translate(offsetX, offsetY);
				p.scale(scale);

				p.noFill();
				p.stroke("#555");
				p.strokeWeight(2);
				p.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

				for (const shape of [...shapes].sort((a, b) => a.z - b.z)) {
					if (shape.id === selectedId) {
						p.stroke("white");
						p.strokeWeight(2);
					} else {
						p.noStroke();
					}
					drawShape(p, {
						...shape,
						x: shape.positionX,
						y: shape.positionY,
					});
				}

				p.noStroke();
				const overCanvas =
					p.mouseX >= 0 &&
					p.mouseY >= 0 &&
					p.mouseX <= p.width &&
					p.mouseY <= p.height;
				if (
					mode === "color-selected" &&
					pendingType &&
					pendingColor &&
					overCanvas
				) {
					const c = clampCenter(
						pendingType as ShapeType,
						DEFAULT_SIZE,
						cursor.x,
						cursor.y,
					);
					drawShape(
						p,
						{
							type: pendingType,
							color: pendingColor,
							size: DEFAULT_SIZE,
							rotation: 0,
							...c,
						},
						128,
					);
				}

				(
					p as unknown as { canvas: HTMLCanvasElement }
				).canvas.style.cursor =
					mode !== "color-selected" &&
					overCanvas &&
					topShapeAt(cursor.x, cursor.y)
						? "pointer"
						: "default";
			};

			p.mousePressed = (e: MouseEvent) => {
				if (!isOnCanvas(e)) {
					return;
				}

				const { mode, place, select, cancel } =
					useEditorStore.getState();
				const { x, y } = toLogical();

				if (mode === "color-selected") {
					place(x, y);
					return;
				}

				const hit = topShapeAt(x, y);
				if (!hit) {
					cancel();
					return;
				}
				select(hit.id);
				drag = {
					id: hit.id,
					dx: hit.positionX - x,
					dy: hit.positionY - y,
				};
			};

			p.mouseDragged = () => {
				if (!drag) {
					return;
				}

				const { x, y } = toLogical();
				useEditorStore
					.getState()
					.moveShape(drag.id, x + drag.dx, y + drag.dy);
			};

			p.mouseReleased = () => {
				drag = null;
			};
		};

		const instance = new p5(sketch);
		return () => instance.remove();
	}, []);

	return <div ref={containerRef} className="absolute inset-0" />;
}
