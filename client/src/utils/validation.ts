export const USERNAME_MIN_LENGTH = 3;

export function validateUsername(username: string): string | null {
	return username.trim().length < USERNAME_MIN_LENGTH
		? `Username should be at least ${USERNAME_MIN_LENGTH} characters`
		: null;
}
