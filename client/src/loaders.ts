import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ApiError } from "./api/client";
import { getDrawings } from "./api/home";
import { USERID_KEY, USERNAME_KEY } from "./constants";

export const homeLoader = async ({ params }: LoaderFunctionArgs) => {
	const username = localStorage.getItem(USERNAME_KEY);
	if (!username) {
		throw redirect("/login");
	}
	try {
		return await getDrawings(username);
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) {
			localStorage.removeItem(USERNAME_KEY);
			localStorage.removeItem(USERID_KEY);
			throw redirect("/login");
		}
		throw err;
	}
};

export const redirectIfLoggedInLoader = () => {
	const username = localStorage.getItem(USERNAME_KEY);
	return username ? redirect(`/${username}/home`) : null;
};
