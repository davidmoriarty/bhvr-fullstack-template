// client/src/lib/route-guard.ts
import { redirect } from "@tanstack/react-router";
import { useAuth } from "./auth";

export function requireAuth(currentPath?: string) {
	const { token } = useAuth.getState();

	if (!token) {
		throw redirect({
			to: "/login",
			search: () => ({
				redirect: currentPath ?? "/",
			}),
		});
	}

	return true;
}
