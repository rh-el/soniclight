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

export const updateDrawingName = (id: string, name: string) =>
	prisma.drawing.update({ where: { id }, data: { name } });

export const replaceDrawingShapes = async (
	drawingId: string,
	shapes: ShapeInput[],
) => {
	const [, created] = await prisma.$transaction([
		prisma.shape.deleteMany({ where: { drawingId } }),
		prisma.shape.createMany({
			data: shapes.map((shape) => ({ ...shape, drawingId })),
		}),
	]);
	return created.count;
};

export const findAllDrawingSummaries = () =>
	prisma.drawing.findMany({
		select: {
			id: true,
			name: true,
			updatedAt: true,
			user: { select: { username: true } },
			_count: { select: { shapes: true } },
		},
		orderBy: { updatedAt: "desc" },
	});
