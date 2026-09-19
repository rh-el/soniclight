import { findUserByUsername } from "../crud/user";
import { InvalidUsernameError, UnknownUserError } from "../exceptions";

const MIN_USERNAME_LENGTH = 3;

export const parseUsername = (username: unknown): string => {
	if (typeof username !== "string") throw new InvalidUsernameError();
	const trimmed = username.trim();
	if (trimmed.length < MIN_USERNAME_LENGTH) throw new InvalidUsernameError();
	return trimmed;
};

export const requireUser = async (username: string | undefined) => {
	const user = await findUserByUsername(parseUsername(username));
	if (!user) throw new UnknownUserError();
	return user;
};
