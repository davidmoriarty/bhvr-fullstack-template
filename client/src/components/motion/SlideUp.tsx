// client/src/components/motion/SlideUp.tsx
import type React from "react";
import type { CSSPropertiesWithVars } from "./types";

type Props = {
	delay?: number;
	duration?: number;
	distance?: number; // px override for vertical slide distance
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
};

export function SlideUp({
	delay = 0,
	duration,
	distance,
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
					...(distance ? { "--distance": `${distance}px` } : {}),
					...style,
				} as CSSPropertiesWithVars
			}
			className={`slide-up anim-will ${className ?? ""}`}
		>
			{children}
		</div>
	);
}
