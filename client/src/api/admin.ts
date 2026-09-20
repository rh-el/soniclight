import type { AdminDrawingsResponse, Drawing } from "../types";
import { request } from "./client";

export const getAllDrawings = (username: string) =>
	request<AdminDrawingsResponse>("/admin/drawings", { method: "GET", username }, "Failed to load drawings");

export const getAnyDrawing = (username: string, drawingId: string) =>
	request<Drawing>(`/admin/drawings/${drawingId}`, { method: "GET", username }, "Failed to load drawing");
