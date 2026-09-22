export const USERNAME_KEY = "soniclight.username";
export const USERID_KEY = "soniclight.userid";
export const ISADMIN_KEY = "soniclight.isadmin";
export const apiBaseUrl = "http://localhost:8000";

export const clearAuthStorage = () => {
	localStorage.removeItem(USERNAME_KEY);
	localStorage.removeItem(USERID_KEY);
	localStorage.removeItem(ISADMIN_KEY);
};
