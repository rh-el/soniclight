import type {
	CreateDrawingResponse,
	Drawing,
	DrawingsResponse,
} from "../types";
import { request } from "./client";

export const createDrawing = (username: string) =>
	request<CreateDrawingResponse>(
		"/drawing",
		{ method: "POST", username },
		"Failed to create drawing",
	);

export const getDrawing = (username: string, drawingId: string) =>
	request<Drawing>(
		`/drawing/${drawingId}`,
		{ method: "GET", username },
		"Failed to load drawing",
	);

export const getDrawings = (username: string) =>
	request<DrawingsResponse>(
		"/drawing",
		{ method: "GET", username },
		"Failed to load drawings",
	);
