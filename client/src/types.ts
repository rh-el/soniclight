export interface SignupResponse {
	userId: string;
	username: string;
}

export interface Shape {
	id: string;
	type: "CIRCLE" | "RECTANGLE" | "TRIANGLE";
	color: string;
	positionX: number;
	positionY: number;
	size: number;
}

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
	drawings: Drawing[];
}

export interface DrawingsResponse {
	username: string;
	drawings: Drawing[];
}
