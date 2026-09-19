import { Router } from "express";
import { listUserDrawings } from "../services/drawing";

export const drawingRouter = Router();

drawingRouter.get("/", async (req, res) => {
	const result = await listUserDrawings(req.username);
	res.json(result);
});
