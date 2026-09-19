import type { SignupResponse } from "../types";
import { request } from "./client";

export const signup = (username: string) =>
	request<SignupResponse>(
		"/user/signup",
		{ method: "POST", body: JSON.stringify({ username }) },
		"Failed to create account",
	);
