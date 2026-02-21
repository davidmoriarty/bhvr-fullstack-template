import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { AuthLoader } from "@/lib/auth/auth-loader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ErrorPage } from "@/components/error/ErrorPage";

function RootLayout() {
	useEffect(() => {
		AuthLoader().catch(() => {});
	}, []);

	return (
		<>
			<HeadContent />
			<Header />
			<main className="flex flex-col flex-1">
				<Outlet />
			</main>
			<Footer />
			<Toaster />
			{import.meta.env.DEV && <TanStackRouterDevtools />}
		</>
	);
}

export const Route = createRootRoute({
	notFoundComponent: () => <ErrorPage status={404} />,
	component: RootLayout,
});
