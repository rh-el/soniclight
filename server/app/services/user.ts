import { createUser, findUserByUsername } from "../crud/user";
import { UsernameAlreadyExistsError } from "../exceptions";
import { parseUsername, requireUser } from "./auth";
import { getDrawings } from "./drawing";

export const signup = async (username: unknown): Promise<SignupResponse> => {
	const trimmed = parseUsername(username);

	if (await findUserByUsername(trimmed))
		throw new UsernameAlreadyExistsError();

	const id = await createUser(trimmed);
	return { userId: id, username: trimmed };
};

export const login = async (username: unknown): Promise<LoginResponse> => {
	const user = await requireUser(username);

	const drawings = await getDrawings(user.id);
	return { userId: user.id, username: user.username, drawings };
};
