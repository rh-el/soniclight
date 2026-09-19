interface SignupResponse {
	userId: string;
	username: string;
}

interface ShapeRecord {
	id: string;
	type: "CIRCLE" | "RECTANGLE" | "TRIANGLE";
	color: string;
	positionX: number;
	positionY: number;
	size: number;
}

interface DrawingRecord {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	shapes: ShapeRecord[];
}

interface LoginResponse {
	userId: string;
	username: string;
	drawings: DrawingRecord[];
}

interface DrawingListResponse {
	username: string;
	drawings: DrawingRecord[];
}

interface CreateDrawingResponse {
	drawingId: string;
}
