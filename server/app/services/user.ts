import { createUser, findUserByUsername } from "../crud/user";
import { ReservedUsernameError, UsernameAlreadyExistsError } from "../exceptions";
import { ADMIN_USERNAME, parseUsername, requireUser } from "./auth";
import { getDrawings } from "./drawing";

export const signup = async (username: unknown): Promise<SignupResponse> => {
	const trimmed = parseUsername(username);

	if (trimmed.toLowerCase() === ADMIN_USERNAME) throw new ReservedUsernameError();

	if (await findUserByUsername(trimmed)) throw new UsernameAlreadyExistsError();

	const id = await createUser(trimmed);
	return { userId: id, username: trimmed, isAdmin: false };
};

export const login = async (username: string | undefined): Promise<LoginResponse> => {
	const user = await requireUser(username);

	const drawings = await getDrawings(user.id);
	return {
		userId: user.id,
		username: user.username,
		isAdmin: user.isAdmin,
		drawings,
	};
};
