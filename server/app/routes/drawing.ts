import { Router } from "express";
import {
	createDrawing,
	getDrawing,
	listUserDrawings,
} from "../services/drawing";

export const drawingRouter = Router();

drawingRouter.get("/", async (req, res) => {
	const result = await listUserDrawings(req.username);
	res.json(result);
});

drawingRouter.post("/", async (req, res) => {
	const result = await createDrawing(req.username);
	res.status(201).json(result);
});

drawingRouter.get("/:id", async (req, res) => {
	const drawing = await getDrawing(req.username, req.params.id);
	res.json(drawing);
});
