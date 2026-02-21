// client/src/routes/_errors/401.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/error/ErrorPage";

function Error401Page() {
	return <ErrorPage status={401} />;
}

export const Route = createFileRoute("/_errors/401")({
	component: Error401Page,
});
