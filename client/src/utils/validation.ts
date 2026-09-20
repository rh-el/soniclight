export const USERNAME_MIN_LENGTH = 3;

export const DRAWING_NAME_MIN_LENGTH = 2;

export function validateDrawingName(name: string): string | null {
	return name.trim().length < DRAWING_NAME_MIN_LENGTH
		? `Title should be at least ${DRAWING_NAME_MIN_LENGTH} characters`
		: null;
}

export function validateUsername(username: string): string | null {
	return username.trim().length < USERNAME_MIN_LENGTH
		? `Username should be at least ${USERNAME_MIN_LENGTH} characters`
		: null;
}
