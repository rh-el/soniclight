interface SignupResponse {
	userId: string;
	username: string;
}

interface LoginResponse {
	userId: string;
	username: string;
	drawings: DrawingRecord[];
}
