interface DrawingRecord {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	shapes: ShapeRecord[];
}

interface DrawingListResponse {
	username: string;
	drawings: DrawingRecord[];
}

interface CreateDrawingResponse {
	drawingId: string;
}

interface SaveShapesResponse {
	drawingId: string;
	shapeCount: number;
}

interface RenameDrawingResponse {
	drawingId: string;
	name: string;
}

interface AdminDrawingSummary {
	id: string;
	name: string;
	ownerUsername: string;
	shapeCount: number;
	updatedAt: Date;
}

interface AdminDrawingListResponse {
	drawings: AdminDrawingSummary[];
}
