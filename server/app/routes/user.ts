import { Router } from "express";
import { login, signup } from "../services/user";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
	const user = await signup(req.body?.username);
	res.status(201).json(user);
});

userRouter.get("/login", async (req, res) => {
	const result = await login(req.username);
	res.json(result);
});
