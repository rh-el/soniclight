import { create } from "zustand";
import type { EditorMode, Shape, ShapeType } from "../types";
import { DEFAULT_SIZE, canRotate, clampCenter } from "../utils/shapes";

interface EditorState {
	shapes: Shape[];
	mode: EditorMode;
	pendingType: ShapeType | null;
	pendingColor: string | null;
	selectedId: string | null;
	nextZ: number;
	chooseType: (type: ShapeType) => void;
	chooseColor: (color: string) => void;
	place: (x: number, y: number) => void;
	select: (id: string) => void;
	moveShape: (id: string, x: number, y: number) => void;
	resizeShape: (id: string, size: number) => void;
	rotateShape: (id: string, rotation: number) => void;
	deleteSelected: () => void;
	cancel: () => void;
	load: (shapes: Shape[]) => void;
	reset: () => void;
}

const idle = {
	mode: "base",
	pendingType: null,
	pendingColor: null,
	selectedId: null,
} as const;

export const useEditorStore = create<EditorState>((set, get) => ({
	shapes: [],
	nextZ: 1,
	...idle,

	// Clicking the active type button again cancels.
	chooseType: (type) => {
		const { mode, pendingType } = get();
		if (mode !== "base" && mode !== "shape-update" && pendingType === type) {
			set(idle);
			return;
		}
		set({ ...idle, mode: "shape-selected", pendingType: type });
	},

	chooseColor: (color) => set({ mode: "color-selected", pendingColor: color }),

	place: (x, y) => {
		const { pendingType, pendingColor, shapes, nextZ } = get();
		if (!pendingType || !pendingColor) return;
		const center = clampCenter(pendingType, DEFAULT_SIZE, x, y);
		set({
			shapes: [
				...shapes,
				{
					id: crypto.randomUUID(),
					type: pendingType,
					color: pendingColor,
					positionX: center.x,
					positionY: center.y,
					size: DEFAULT_SIZE,
					z: nextZ,
					rotation: 0,
				},
			],
			nextZ: nextZ + 1,
			...idle,
		});
	},

	// Selecting brings the shape to the front.
	select: (id) => {
		const { selectedId, nextZ, shapes } = get();
		if (selectedId === id) {
			return;
		}
		set({
			shapes: shapes.map((s) => (s.id === id ? { ...s, z: nextZ } : s)),
			nextZ: nextZ + 1,
			mode: "shape-update",
			pendingType: null,
			pendingColor: null,
			selectedId: id,
		});
	},

	moveShape: (id, x, y) =>
		set({
			shapes: get().shapes.map((s) => {
				if (s.id !== id) return s;
				const c = clampCenter(s.type, s.size, x, y, s.rotation);
				return { ...s, positionX: c.x, positionY: c.y };
			}),
		}),

	resizeShape: (id, size) =>
		set({
			shapes: get().shapes.map((s) => {
				if (s.id !== id) return s;
				const c = clampCenter(s.type, size, s.positionX, s.positionY, s.rotation);
				return { ...s, size, positionX: c.x, positionY: c.y };
			}),
		}),

	rotateShape: (id, rotation) =>
		set({
			shapes: get().shapes.map((s) => {
				if (s.id !== id || !canRotate(s.type)) return s;
				const c = clampCenter(s.type, s.size, s.positionX, s.positionY, rotation);
				return { ...s, rotation, positionX: c.x, positionY: c.y };
			}),
		}),

	deleteSelected: () => {
		const { selectedId, shapes } = get();
		if (!selectedId) return;
		set({ shapes: shapes.filter((s) => s.id !== selectedId), ...idle });
	},

	cancel: () => set(idle),

	load: (shapes) =>
		set({
			shapes,
			nextZ: Math.max(0, ...shapes.map((s) => s.z)) + 1,
			...idle,
		}),

	reset: () => set({ shapes: [], nextZ: 1, ...idle }),
}));
