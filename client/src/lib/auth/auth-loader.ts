// client/src/lib/auth-loader.ts
import { setAuthToken, useAuth } from "@/lib/auth";

let refreshing: Promise<void> | null = null;

export async function AuthLoader() {
	if (useAuth.getState().token) return;
	if (refreshing) return refreshing;

	refreshing = (async () => {
		const setToken = useAuth.getState().setToken;

		const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		// Silent "not logged in" path
		if (res.status === 401) {
			setToken(null);
			return;
		}

		// Other failures: also just reset state (still no noise)
		if (!res.ok) {
			setToken(null);
			return;
		}

		// Only parse JSON when we know it's OK
		const { token } = (await res.json()) as { token: string };
		setAuthToken(token);
		setToken(token);
	})().finally(() => {
		refreshing = null;
	});

	return refreshing;
}
