// client/src/components/motion/FadeIn.tsx
import type React from "react";
import type { CSSPropertiesWithVars } from "./types";

type Props = {
	delay?: number;
	duration?: number;
	y?: number;
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
};

export function FadeIn({
	delay = 0,
	duration,
	y,
	className,
	style,
	children,
}: Props) {
	return (
		<div
			style={
				{
					"--delay": `${delay}ms`,
					...(duration ? { "--duration": `${duration}ms` } : {}),
					...(y ? { "--y": `${y}px` } : {}),
					...style,
				} as CSSPropertiesWithVars
			}
			className={`fade-in anim-will ${className ?? ""}`}
		>
			{children}
		</div>
	);
}
