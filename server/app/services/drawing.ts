import {
	createDrawing as insertDrawing,
	findDrawingById,
	findDrawingsByUserId,
	replaceDrawingShapes,
	updateDrawingName,
} from "../crud/drawing";
import {
	DrawingNotFoundError,
	ForbiddenDrawingError,
	InvalidDrawingIdError,
	InvalidDrawingNameError,
	InvalidShapeError,
} from "../exceptions";
import { requireUser } from "./auth";

const DEFAULT_DRAWING_NAME = "Untitled drawing";
const DRAWING_NAME_MIN_LENGTH = 2;
export const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getDrawings = (userId: string) => findDrawingsByUserId(userId);

export const listUserDrawings = async (
	username: string | undefined,
): Promise<DrawingListResponse> => {
	const user = await requireUser(username);
	const drawings = await getDrawings(user.id);
	return { username: user.username, drawings };
};

export const createDrawing = async (
	username: string | undefined,
): Promise<CreateDrawingResponse> => {
	const user = await requireUser(username);
	const drawing = await insertDrawing(user.id, DEFAULT_DRAWING_NAME);
	return { drawingId: drawing.id };
};

export const getOwnedDrawing = async (username: string | undefined, drawingId: string) => {
	if (!UUID_REGEX.test(drawingId)) {
		throw new InvalidDrawingIdError();
	}

	const user = await requireUser(username);
	const drawing = await findDrawingById(drawingId);

	if (!drawing) {
		throw new DrawingNotFoundError();
	}
	if (drawing.userId !== user.id) {
		throw new ForbiddenDrawingError();
	}
	return drawing;
};

const SHAPE_TYPES = ["CIRCLE", "RECTANGLE", "TRIANGLE"] as const;
const SHAPE_COLORS = ["a", "b", "c", "d", "e"] as const;
const CANVAS_SIZE = 1000;
const MIN_SIZE = 40;
const MAX_SIZE = 400;
const MAX_ROTATION = 359;

const isNumberInRange = (value: unknown, min: number, max: number) =>
	typeof value === "number" &&
	Number.isFinite(value) &&
	value >= min &&
	value <= max;

const parseShape = (raw: unknown): ShapeInput => {
	const s = (raw ?? {}) as Record<string, unknown>;
	if (!SHAPE_TYPES.includes(s.type as ShapeInput["type"])) {
		throw new InvalidShapeError("Invalid shape type");
	}
	if (!SHAPE_COLORS.includes(s.color as ShapeInput["color"])) {
		throw new InvalidShapeError("Invalid shape color");
	}
	if (!isNumberInRange(s.positionX, 0, CANVAS_SIZE)) {
		throw new InvalidShapeError("Invalid shape positionX");
	}
	if (!isNumberInRange(s.positionY, 0, CANVAS_SIZE)) {
		throw new InvalidShapeError("Invalid shape positionY");
	}
	if (!isNumberInRange(s.size, MIN_SIZE, MAX_SIZE)) {
		throw new InvalidShapeError("Invalid shape size");
	}
	if (!isNumberInRange(s.rotation, 0, MAX_ROTATION)) {
		throw new InvalidShapeError("Invalid shape rotation");
	}
	if (!Number.isInteger(s.z)) {
		throw new InvalidShapeError("Invalid shape z");
	}
	return {
		type: s.type as ShapeInput["type"],
		color: s.color as ShapeInput["color"],
		positionX: s.positionX as number,
		positionY: s.positionY as number,
		size: s.size as number,
		rotation: s.rotation as number,
		z: s.z as number,
	};
};

export const saveDrawingShapes = async (
	username: string | undefined,
	drawingId: string,
	shapes: unknown,
): Promise<SaveShapesResponse> => {
	const drawing = await getOwnedDrawing(username, drawingId);

	if (!Array.isArray(shapes)) {
		throw new InvalidShapeError("shapes must be an array");
	}
	const parsed = shapes.map(parseShape);
	const shapeCount = await replaceDrawingShapes(drawing.id, parsed);
	return { drawingId: drawing.id, shapeCount };
};

export const renameDrawing = async (
	username: string | undefined,
	drawingId: string,
	name: unknown,
): Promise<RenameDrawingResponse> => {
	const drawing = await getOwnedDrawing(username, drawingId);

	if (typeof name !== "string" || name.trim().length < DRAWING_NAME_MIN_LENGTH) {
		throw new InvalidDrawingNameError();
	}
	const updated = await updateDrawingName(drawing.id, name.trim());
	return { drawingId: updated.id, name: updated.name };
};
