import { findAllDrawingSummaries, findDrawingById } from "../crud/drawing";
import { DrawingNotFoundError, InvalidDrawingIdError } from "../exceptions";
import { requireAdmin } from "./auth";
import { UUID_REGEX } from "./drawing";

export const listAllDrawings = async (username: string | undefined): Promise<AdminDrawingListResponse> => {
	await requireAdmin(username);
	const drawings = await findAllDrawingSummaries();
	return {
		drawings: drawings.map((d) => ({
			id: d.id,
			name: d.name,
			ownerUsername: d.user.username,
			shapeCount: d._count.shapes,
			updatedAt: d.updatedAt,
		})),
	};
};

export const getAnyDrawing = async (username: string | undefined, drawingId: string) => {
	if (!UUID_REGEX.test(drawingId)) {
		throw new InvalidDrawingIdError();
	}

	await requireAdmin(username);
	const drawing = await findDrawingById(drawingId);
	if (!drawing) {
		throw new DrawingNotFoundError();
	}
	return drawing;
};
