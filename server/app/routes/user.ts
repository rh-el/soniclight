import { Router } from "express";
import { signup } from "../services/user";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
	const user = await signup(req.body?.username);
	res.status(201).json(user);
});
