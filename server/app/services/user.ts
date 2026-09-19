import { createUser, findUserByUsername } from "../crud/user";
import {
	InvalidUsernameError,
	UnknownUserError,
	UsernameAlreadyExistsError,
} from "../exceptions";
import { getDrawings } from "./drawing";

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

export const login = async (username: unknown): Promise<LoginResponse> => {
	if (typeof username !== "string") throw new InvalidUsernameError();
	const trimmed = username.trim();
	if (trimmed.length < MIN_USERNAME_LENGTH) throw new InvalidUsernameError();

	const user = await findUserByUsername(trimmed);
	if (!user) throw new UnknownUserError();

	const drawings = await getDrawings(user.id);
	return { userId: user.id, username: user.username, drawings };
};
