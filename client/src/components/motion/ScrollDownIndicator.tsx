// client/src/components/motion/ScrollDownIndicator.tsx
// Decorative scroll hint arrow
import { motion } from "framer-motion";

export function ScrollDownIndicator() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 3.0, repeat: Infinity, repeatType: "reverse" }}
			className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer select-none"
			onClick={() => {
				const el = document.getElementById("features-section");
				if (el) el.scrollIntoView({ behavior: "smooth" });
			}}
		>
			<svg
				aria-hidden="true"
				focusable="false"
				width="64"
				height="64"
				viewBox="0 0 24 24"
				className="stroke-primary dark:stroke-primary"
				strokeWidth="1.5"
				fill="none"
			>
				<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</motion.div>
	);
}
