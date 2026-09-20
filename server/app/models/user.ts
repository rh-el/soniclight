interface SignupResponse {
	userId: string;
	username: string;
	isAdmin: boolean;
}

interface LoginResponse {
	userId: string;
	username: string;
	isAdmin: boolean;
	drawings: DrawingRecord[];
}
