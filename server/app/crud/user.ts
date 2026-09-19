import { prisma } from "../core/db";

export const findUserByUsername = (username: string) =>
	prisma.user.findUnique({ where: { username } });

export const createUser = async (username: string): Promise<string> => {
	const user = await prisma.user.create({ data: { username } });
	return user.id;
};
