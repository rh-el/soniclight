export class AppError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = new.target.name;
	}
}

export class InvalidUsernameError extends AppError {
	constructor(
		message = "Username must be a string of at least 3 characters",
	) {
		super(message, 400);
	}
}

export class UsernameAlreadyExistsError extends AppError {
	constructor(message = "Username already exists") {
		super(message, 409);
	}
}

export class UnknownUserError extends AppError {
	constructor(message = "Unknown username") {
		super(message, 401);
	}
}

export class DrawingNotFoundError extends AppError {
	constructor(message = "Drawing not found") {
		super(message, 404);
	}
}
export class InvalidDrawingIdError extends AppError {
	constructor(message = "Invalid drawing ID") {
		super(message, 400);
	}
}

export class ForbiddenDrawingError extends AppError {
	constructor(message = "Drawing does not belong to user") {
		super(message, 403);
	}
}

export class InvalidShapeError extends AppError {
	constructor(message = "Invalid shape") {
		super(message, 400);
	}
}

export class InvalidDrawingNameError extends AppError {
	constructor(message = "Drawing name must be at least 2 characters") {
		super(message, 400);
	}
}
