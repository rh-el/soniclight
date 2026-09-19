interface ShapeInput {
	type: "CIRCLE" | "RECTANGLE" | "TRIANGLE";
	color: "red" | "orange" | "green" | "blue" | "purple";
	positionX: number;
	positionY: number;
	size: number;
	rotation: number;
	z: number;
}

type ShapeRecord = ShapeInput & { id: string };
