// client/src/components/ui/Section.tsx
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

type Props = {
	children: ReactNode;
	className?: string;
};

export function Hero({ children, className = "" }: Props) {
	return (
		<Section centered className={className}>
			<Container>
				<h1 className="text-4xl md:text-5xl font-black">{children}</h1>
			</Container>
		</Section>
	);
}
