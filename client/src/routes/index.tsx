// client/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollDownIndicator } from "@/components/motion/ScrollDownIndicator";
import { LinkButton } from "@/components/layout/LinkButton";
import { buildHead } from "@/lib/meta";

function LandingPage() {
	return (
		<PageTransition>
			<PageHeader
				title="Full Stack App"
				subtitle="App description goes here."
				actions={
					<LinkButton to="/login" variant="default" size="lg">
						Get Started!
					</LinkButton>
				}
				indicator={<ScrollDownIndicator />}
			/>
		</PageTransition>
	);
}

export const Route = createFileRoute("/")({
	head: () =>
		buildHead({
			title: "Full Stack App",
			description: "App description goes here.",
			path: "/",
		}),
	component: LandingPage,
});
