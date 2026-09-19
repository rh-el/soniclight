import { prisma } from "../core/db";

export const findDrawingsByUserId = (userId: string) =>
	prisma.drawing.findMany({
		where: { userId },
		include: { shapes: true },
		orderBy: { createdAt: "asc" },
	});
