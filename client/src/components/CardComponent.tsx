import type { Drawing } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Plus } from "lucide-react";

interface CardComponentProps {
	drawingData?: Drawing;
	username?: string;
	isEmpty?: boolean;
	onCreate?: () => void;
}

export default function CardComponent({
	drawingData,
	username,
	isEmpty = false,
	onCreate,
}: CardComponentProps) {
	if (isEmpty) {
		return (
			<Card
				className="w-full h-103 flex items-center justify-center cursor-pointer border-dashed border-border hover:border-primary-light/50 hover:bg-primary/5 transition-colors"
				onClick={onCreate}
			>
				<Plus className="h-6 w-6 text-muted-foreground stroke-primary-light" />
			</Card>
		);
	}
	return (
		<Card className="bg-card/50 border-border/50">
			<CardContent className="flex flex-col gap-3">
				<div className="aspect-square w-full rounded-md bg-muted" />
				<div className="flex flex-col">
					<h2 className="font-mono font-bold text-foreground">
						{drawingData?.name}
					</h2>
					<p className="font-mono text-sm text-muted-foreground">
						{username}
					</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full font-mono bg-primary/20 text-primary-light cursor-pointer hover:text-foreground">
					edit
				</Button>
			</CardFooter>
		</Card>
	);
}
