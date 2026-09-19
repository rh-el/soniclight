import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ApiError } from "./api/client";
import { getDrawing, getDrawings } from "./api/drawing";
import { USERID_KEY, USERNAME_KEY } from "./constants";

const logoutRedirect = () => {
	localStorage.removeItem(USERNAME_KEY);
	localStorage.removeItem(USERID_KEY);
	return redirect("/login");
};

export const homeLoader = async () => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	try {
		return await getDrawings(username);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			throw logoutRedirect();
		}
		throw err;
	}
};

export const drawLoader = async ({ params }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	try {
		return await getDrawing(username, params.drawid ?? "");
	} catch (err) {
		if (err instanceof ApiError && [401, 403, 404].includes(err.status)) {
			throw logoutRedirect();
		}
		throw err;
	}
};

export const redirectIfLoggedInLoader = () => {
	const username = localStorage.getItem(USERNAME_KEY);
	return username ? redirect(`/${username}/home`) : null;
};
