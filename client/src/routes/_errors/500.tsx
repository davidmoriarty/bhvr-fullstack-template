// client/src/routes/_errors/500.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/error/ErrorPage";

function Error500Page() {
	return <ErrorPage status={500} />;
}

export const Route = createFileRoute("/_errors/500")({
	component: Error500Page,
});
