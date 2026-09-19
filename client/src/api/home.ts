import type { DrawingsResponse } from "../types";
import { request } from "./client";

export const getDrawings = (username: string) =>
	request<DrawingsResponse>(
		"/drawing",
		{ method: "GET", username },
		"Failed to load drawings",
	);
