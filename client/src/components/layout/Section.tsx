// client/src/components/ui/Section.tsx
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	centered?: boolean;
	gap?: string;
	padding?: string;
};

export function Section({
	children,
	className = "",
	centered = false,
	gap = "gap-4",
	padding = "p-6 md:p-10",
}: Props) {
	return (
		<section
			className={`w-screen mx-auto flex flex-col ${centered ? "items-center justify-center text-center" : ""} ${gap} ${padding} ${className}`}
		>
			{children}
		</section>
	);
}
