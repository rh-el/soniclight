import { Router } from "express";
import { drawingRouter } from "./drawing";
import { userRouter } from "./user";

export const router = Router();

router.use("/user", userRouter);
router.use("/drawing", drawingRouter);

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});
