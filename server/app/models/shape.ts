interface ShapeInput {
	type: "CIRCLE" | "RECTANGLE" | "TRIANGLE";
	color: "a" | "b" | "c" | "d" | "e";
	positionX: number;
	positionY: number;
	size: number;
	rotation: number;
	z: number;
}

type ShapeRecord = ShapeInput & { id: string };
