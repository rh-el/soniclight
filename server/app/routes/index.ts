import { Router } from "express";
import { adminRouter } from "./admin";
import { drawingRouter } from "./drawing";
import { userRouter } from "./user";

export const router = Router();

router.use("/user", userRouter);
router.use("/drawing", drawingRouter);
router.use("/admin", adminRouter);

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});
