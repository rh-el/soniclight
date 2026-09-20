import type { Shape } from "../types";
import { CANVAS_SIZE, MAX_SIZE, MIN_SIZE } from "../utils/shapes";
import {
	DISTANCE_CURVE,
	MAX_DISTANCE,
	MIN_DISTANCE,
	MIN_GAIN,
	REF_DISTANCE,
	SIZE_CURVE,
	SIZE_MIN_GAIN,
	WET_MAX,
} from "./constants";

export interface Position {
	x: number;
	y: number;
	z: number;
}

const HALF = CANVAS_SIZE / 2;

// 0 within REF_DISTANCE of the center, 1 at the far corner.
const farness = (position: Position) => {
	const distance = Math.hypot(position.x, position.z);
	return Math.min(Math.max((distance - REF_DISTANCE) / (MAX_DISTANCE - REF_DISTANCE), 0), 1);
};

// listener at the canvas center facing the top: up = front (-z), down = behind (+z), flat plane.
export function shapePosition(shape: Pick<Shape, "positionX" | "positionY">): Position {
	const x = (shape.positionX - HALF) / HALF;
	const z = (shape.positionY - HALF) / HALF;
	const distance = Math.hypot(x, z);
	if (distance >= MIN_DISTANCE) return { x, y: 0, z };
	if (distance === 0) return { x: 0, y: 0, z: -MIN_DISTANCE };
	const k = MIN_DISTANCE / distance;
	return { x: x * k, y: 0, z: z * k };
}

export function distanceVolume(position: Position) {
	return 1 - (1 - MIN_GAIN) * farness(position) ** DISTANCE_CURVE;
}

// the bigger the shape, the louder.
export function sizeVolume(shape: Pick<Shape, "size">) {
	const s = Math.min(Math.max((shape.size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE), 0), 1);
	return SIZE_MIN_GAIN + (1 - SIZE_MIN_GAIN) * s ** SIZE_CURVE;
}

export function reverbSend(position: Position) {
	return WET_MAX * farness(position);
}
