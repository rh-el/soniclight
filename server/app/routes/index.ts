import { Router } from "express";
import { userRouter } from "./user";

export const router = Router();

router.use("/user", userRouter);

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});
