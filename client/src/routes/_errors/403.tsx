// client/src/routes/_errors/403.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/error/ErrorPage";

function Error403Page() {
	return <ErrorPage status={403} />;
}

export const Route = createFileRoute("/_errors/403")({
	component: Error403Page,
});
