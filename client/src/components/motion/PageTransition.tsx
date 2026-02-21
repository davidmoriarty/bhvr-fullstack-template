// client/src/components/motion/PageTransition.tsx
import { useEffect, useState } from "react";
import type { CSSPropertiesWithVars } from "./types";

type Props = {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	distance?: number; // px
	easing?: string; // "var(--anim-ease)" | "ease-out" etc.
	className?: string;
	style?: React.CSSProperties;
};

export function PageTransition({
	children,
	delay = 0,
	duration,
	distance,
	easing,
	className,
	style,
}: Props) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		// Wait for next frame to ensure CSS can animate from initial state
		const id = requestAnimationFrame(() => setActive(true));
		return () => cancelAnimationFrame(id);
	}, []);

	return (
		<div
			style={
				{
					"--delay": `${delay}ms`,
					...(duration ? { "--duration": `${duration}ms` } : {}),
					...(distance ? { "--distance": `${distance}px` } : {}),
					...(easing ? { "--easing": easing } : {}),
					...style,
				} as CSSPropertiesWithVars
			}
			className={`page-enter ${active ? "page-enter-active" : ""} anim-will ${className ?? ""}`}
		>
			{children}
		</div>
	);
}
