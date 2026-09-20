import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { signup } from "../api/auth";
import { ISADMIN_KEY, USERID_KEY, USERNAME_KEY } from "../constants";
import { validateUsername } from "../utils/validation";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const validationError = validateUsername(username);
		if (validationError) {
			setError(validationError);
			return;
		}
		const trimmed = username.trim();

		try {
			const data = await signup(trimmed);
			localStorage.setItem(USERNAME_KEY, trimmed);
			localStorage.setItem(USERID_KEY, data.userId);
			localStorage.setItem(ISADMIN_KEY, String(data.isAdmin));
			navigate(`/${data.username}/home`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create account");
		}
	};

	return (
		<div className="min-h-dvh w-full flex items-center justify-center overflow-hidden bg-background p-4 md:p-0">
			<div className="w-full flex flex-col gap-10 max-w-md">
				<div className="text-center">
					<h1 className="font-bold font-mono tracking-tight text-6xl md:text-7xl text-foreground">
						SonicLight
					</h1>
				</div>

				<Card className="bg-card/50 border-border/50">
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-4">
							<CardContent className="space-y-2">
								<Label htmlFor="username">username</Label>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									placeholder="choose a username"
									value={username}
									onChange={(e) => {
										setUsername(e.target.value);
										setError(null);
									}}
									required
									aria-invalid={Boolean(error)}
								/>
								{error && (
									<p className="text-sm text-destructive">
										{error}
									</p>
								)}
							</CardContent>

							<CardFooter className="flex flex-col gap-3 pt-2">
								<Button
									type="submit"
									className="w-full font-mono"
								>
									create account
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full font-mono transition-colors"
									onClick={() => navigate("/login")}
								>
									already have an account?
								</Button>
							</CardFooter>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}
