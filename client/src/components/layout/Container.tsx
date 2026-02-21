// client/src/components/ui/Container.tsx
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export function Container({ children, className = "" }: Props) {
	return (
		<div className={`container mx-auto px-4 ${className}`}>{children}</div>
	);
}
