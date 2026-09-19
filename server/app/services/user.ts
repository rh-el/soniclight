import { createUser, findUserByUsername } from "../crud/user";
import {
	InvalidUsernameError,
	UsernameAlreadyExistsError,
} from "../exceptions";

const MIN_USERNAME_LENGTH = 3;

export const signup = async (username: unknown): Promise<SignupResponse> => {
	if (typeof username !== "string") throw new InvalidUsernameError();
	const trimmed = username.trim();
	if (trimmed.length < MIN_USERNAME_LENGTH) throw new InvalidUsernameError();

	if (await findUserByUsername(trimmed))
		throw new UsernameAlreadyExistsError();

	const id = await createUser(trimmed);
	return { userId: id, username: trimmed };
};
