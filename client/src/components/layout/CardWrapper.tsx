// client/src/components/ui/CardWrapper.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
	children: ReactNode;
	className?: string;
};

export function CardWrapper({ children, className = "" }: Props) {
	return (
		<div
			className={cn(
				"card-wrapper bg-card text-card-foreground border border-border/60 rounded-lg p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md",
				className,
			)}
		>
			{children}
		</div>
	);
}
