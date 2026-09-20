import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ApiError } from "./api/client";
import { getDrawing, getDrawings } from "./api/drawing";
import { getAllDrawings, getAnyDrawing } from "./api/admin";
import { ISADMIN_KEY, USERID_KEY, USERNAME_KEY } from "./constants";

const logoutRedirect = () => {
	localStorage.removeItem(USERNAME_KEY);
	localStorage.removeItem(USERID_KEY);
	localStorage.removeItem(ISADMIN_KEY);
	return redirect("/login");
};

const ownUrlRedirect = (params: LoaderFunctionArgs["params"], username: string, request: Request) =>
	params.username && params.username !== username
		? redirect(new URL(request.url).pathname.replace(`/${params.username}/`, `/${username}/`))
		: null;

export const homeLoader = async ({ params, request }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	const own = ownUrlRedirect(params, username, request);
	if (own) {
		throw own;
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

export const drawLoader = async ({ params, request }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	const own = ownUrlRedirect(params, username, request);
	if (own) {
		throw own;
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

const notAdminRedirect = (username: string) => {
	localStorage.setItem(ISADMIN_KEY, "false");
	return redirect(`/${username}/home`);
};

export const adminLoader = async ({ params, request }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	const own = ownUrlRedirect(params, username, request);
	if (own) {
		throw own;
	}
	try {
		return await getAllDrawings(username);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			throw logoutRedirect();
		}
		if (err instanceof ApiError && err.status === 403) {
			throw notAdminRedirect(username);
		}
		throw err;
	}
};

export const adminDrawingLoader = async ({ params }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	try {
		return await getAnyDrawing(username, params.drawid ?? "");
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			throw logoutRedirect();
		}
		if (err instanceof ApiError && err.status === 403) {
			throw notAdminRedirect(username);
		}
		if (err instanceof ApiError && [400, 404].includes(err.status)) {
			throw redirect("/admin");
		}
		throw err;
	}
};
