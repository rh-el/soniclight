import { findDrawingsByUserId } from "../crud/drawing";
import { requireUser } from "./auth";

export const getDrawings = (userId: string) => findDrawingsByUserId(userId);

export const listUserDrawings = async (
	username: unknown,
): Promise<DrawingListResponse> => {
	const user = await requireUser(username);
	const drawings = await getDrawings(user.id);
	return { username: user.username, drawings };
};
