// client/src/routes/profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import { useAuth } from "@/lib/auth";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function ProfilePage() {
	const { user } = useAuth();

	return (
		<PageTransition className="min-h-screen">
			<PageHeader
				title="Profile Page"
				subtitle={user?.name}
				actions={user?.email}
				className="relative"
			/>
		</PageTransition>
	);
}

export const Route = createFileRoute("/profile")({
	beforeLoad: async () => {
		requireAuth();
	},

	head: () =>
		buildHead({
			title: "Profile",
			description:
				"Authenticated user profile secured with JWT access tokens and rotating refresh tokens.",
			path: "/profile",
		}),

	component: ProfilePage,
});
