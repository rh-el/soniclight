import { findDrawingsByUserId } from "../crud/drawing";

export const getDrawings = (userId: string) => findDrawingsByUserId(userId);
