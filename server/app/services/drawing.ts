import {
	createDrawing as insertDrawing,
	findDrawingById,
	findDrawingsByUserId,
} from "../crud/drawing";
import { DrawingNotFoundError, ForbiddenDrawingError } from "../exceptions";
import { requireUser } from "./auth";

const DEFAULT_DRAWING_NAME = "Untitled drawing";
const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getDrawings = (userId: string) => findDrawingsByUserId(userId);

export const listUserDrawings = async (
	username: unknown,
): Promise<DrawingListResponse> => {
	const user = await requireUser(username);
	const drawings = await getDrawings(user.id);
	return { username: user.username, drawings };
};

export const createDrawing = async (
	username: unknown,
): Promise<CreateDrawingResponse> => {
	const user = await requireUser(username);
	const drawing = await insertDrawing(user.id, DEFAULT_DRAWING_NAME);
	return { drawingId: drawing.id };
};

export const getDrawing = async (username: unknown, drawingId: string) => {
	const user = await requireUser(username);
	if (!UUID_REGEX.test(drawingId)) throw new DrawingNotFoundError();

	const drawing = await findDrawingById(drawingId);
	if (!drawing) throw new DrawingNotFoundError();
	if (drawing.userId !== user.id) throw new ForbiddenDrawingError();
	return drawing;
};
