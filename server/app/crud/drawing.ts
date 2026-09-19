import { prisma } from "../core/db";

export const findDrawingsByUserId = (userId: string) =>
	prisma.drawing.findMany({
		where: { userId },
		include: { shapes: true },
		orderBy: { createdAt: "asc" },
	});

export const createDrawing = (userId: string, name: string) =>
	prisma.drawing.create({ data: { userId, name }, include: { shapes: true } });

export const findDrawingById = (id: string) =>
	prisma.drawing.findUnique({ where: { id }, include: { shapes: true } });
