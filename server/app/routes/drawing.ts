import { Router } from "express";
import {
	createDrawing,
	getOwnedDrawing,
	listUserDrawings,
	renameDrawing,
	saveDrawingShapes,
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
	const drawing = await getOwnedDrawing(req.username, req.params.id);
	res.json(drawing);
});

drawingRouter.put("/:id/shapes", async (req, res) => {
	const result = await saveDrawingShapes(
		req.username,
		req.params.id,
		req.body?.shapes,
	);
	res.json(result);
});

drawingRouter.patch("/:id", async (req, res) => {
	const result = await renameDrawing(req.username, req.params.id, req.body?.name);
	res.json(result);
});
