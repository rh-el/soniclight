import type {
	CreateDrawingResponse,
	Drawing,
	DrawingsResponse,
	RenameDrawingResponse,
	SaveShapesResponse,
	Shape,
} from "../types";
import { request } from "./client";

export const createDrawing = (username: string) =>
	request<CreateDrawingResponse>("/drawing", { method: "POST", username }, "Failed to create drawing");

export const getDrawing = (username: string, drawingId: string) =>
	request<Drawing>(`/drawing/${drawingId}`, { method: "GET", username }, "Failed to load drawing");

export const getDrawings = (username: string) =>
	request<DrawingsResponse>("/drawing", { method: "GET", username }, "Failed to load drawings");

export const saveDrawingShapes = (username: string, drawingId: string, shapes: Shape[]) =>
	request<SaveShapesResponse>(
		`/drawing/${drawingId}/shapes`,
		{
			method: "PUT",
			username,
			body: JSON.stringify({
				shapes: shapes.map(({ id: _id, ...shape }) => shape),
			}),
		},
		"Failed to save drawing",
	);

export const renameDrawing = (username: string, drawingId: string, name: string) =>
	request<RenameDrawingResponse>(
		`/drawing/${drawingId}`,
		{ method: "PATCH", username, body: JSON.stringify({ name }) },
		"Failed to rename drawing",
	);
