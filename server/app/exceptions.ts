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
	constructor(message = "Username must be a string of at least 3 characters") {
		super(message, 400);
	}
}

export class UsernameAlreadyExistsError extends AppError {
	constructor(message = "Username already exists") {
		super(message, 409);
	}
}
