import { RequestHandler } from "express";

declare module "express-serve-static-core" {
	interface Request {
		username?: string;
	}
}

export const USERNAME_HEADER = "x-username";

export const resolveUsername: RequestHandler = (req, _res, next) => {
	const header = req.header(USERNAME_HEADER);
	req.username = header?.trim() || undefined;
	next();
};

export const requireUsername: RequestHandler = (req, res, next) => {
	if (!req.username) {
		res.status(401).json({ error: "Missing X-Username header" });
		return;
	}
	next();
};
