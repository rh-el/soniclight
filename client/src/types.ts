export interface SignupResponse {
	userId: string;
	username: string;
	isAdmin: boolean;
}

export type ShapeType = "CIRCLE" | "RECTANGLE" | "TRIANGLE";

export interface Shape {
	id: string;
	type: ShapeType;
	color: string;
	positionX: number;
	positionY: number;
	size: number;
	z: number;
	rotation: number;
}

export type EditorMode = "base" | "shape-selected" | "color-selected" | "shape-update";

export interface Drawing {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	shapes: Shape[];
}

export interface LoginResponse {
	userId: string;
	username: string;
	isAdmin: boolean;
	drawings: Drawing[];
}

export interface DrawingsResponse {
	username: string;
	drawings: Drawing[];
}

export interface CreateDrawingResponse {
	drawingId: string;
}

export interface SaveShapesResponse {
	drawingId: string;
	shapeCount: number;
}

export interface RenameDrawingResponse {
	drawingId: string;
	name: string;
}

export interface AdminDrawingSummary {
	id: string;
	name: string;
	ownerUsername: string;
	shapeCount: number;
	updatedAt: string;
}

export interface AdminDrawingsResponse {
	drawings: AdminDrawingSummary[];
}
