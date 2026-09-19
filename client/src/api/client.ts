import { apiBaseUrl } from "../constants";

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
	}
}

export async function request<T>(
	path: string,
	options: RequestInit & { username?: string } = {},
	fallbackMessage = "Request failed",
): Promise<T> {
	const { username, headers, ...init } = options;
	const response = await fetch(`${apiBaseUrl}/api${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(username ? { "X-Username": username } : {}),
			...headers,
		},
	});

	if (!response.ok) {
		const data = await response.json().catch(() => null);
		throw new ApiError(data?.error || fallbackMessage, response.status);
	}

	return response.json();
}
