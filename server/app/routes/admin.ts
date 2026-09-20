import { Router } from "express";
import { getAnyDrawing, listAllDrawings } from "../services/admin";

export const adminRouter = Router();

adminRouter.get("/drawings", async (req, res) => {
	const result = await listAllDrawings(req.username);
	res.json(result);
});

adminRouter.get("/drawings/:id", async (req, res) => {
	const drawing = await getAnyDrawing(req.username, req.params.id);
	res.json(drawing);
});
