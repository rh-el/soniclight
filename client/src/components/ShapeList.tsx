import { cn } from "../lib/utils";
import { useEditorStore } from "../state-management/editor";
import { shapeName } from "../utils/shapes";

const baseItemStyle = "rounded-md py-2 text-xs transition-[padding_color] h-8";

export default function ShapeList({ readOnly = false }: { readOnly?: boolean }) {
	const shapes = useEditorStore((s) => s.shapes);
	const selectedId = useEditorStore((s) => s.selectedId);
	const select = useEditorStore((s) => s.select);

	return (
		<ul className="flex flex-col gap-1">
			{shapes.map((shape) => (
				<li
					key={shape.id}
					className={cn(
						baseItemStyle,
						!readOnly && "cursor-pointer",
						selectedId === shape.id
							? "bg-primary-light/10 px-4 text-primary-light"
							: "px-2 hover:bg-border/20",
					)}
					onClick={readOnly ? undefined : () => select(shape.id)}
				>
					{shapeName(shape)}
				</li>
			))}
		</ul>
	);
}
