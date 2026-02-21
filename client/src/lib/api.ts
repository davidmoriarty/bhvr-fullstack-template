// client/src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { setAuthToken, useAuth } from "@/lib/auth";

let refreshingToken: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
	const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
		method: "POST",
		credentials: "include",
	});

	if (!refreshRes.ok) {
		// Silent on initial boot: no cookie / expired cookie is normal
		useAuth.getState().setToken(null);
		return null;
	}

	const { token: newToken } = (await refreshRes.json()) as { token: string };
	setAuthToken(newToken);
	return newToken;
}

/** Basic helper that automatically sends JSON and optional auth token */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const { token } = useAuth.getState();

	const headersObj: Record<string, string> = {
		"Content-Type": "application/json",
	};

	// Merge in any headers from options if they are a plain object
	if (options.headers && !(options.headers instanceof Headers)) {
		Object.assign(headersObj, options.headers);
	}

	// Add Authorization if we have a token
	if (token) headersObj.Authorization = `Bearer ${token}`;

	let res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: headersObj,
		credentials: "include",
	});

	if (res.status === 401 && path !== "/auth/refresh") {
		// Deduplicate multiple refreshes
		if (!refreshingToken) {
			refreshingToken = (async () => {
				const newToken = await tryRefreshToken();
				refreshingToken = null;
				return newToken;
			})();
		}

		const newToken = await refreshingToken;

		// If refresh failed, propagate the original 401 as a normal app-level unauthorized
		if (!newToken) {
			const error = await res.json().catch(() => ({}));
			throw new Error(error.error || "Unauthorized");
		}

		headersObj.Authorization = `Bearer ${newToken}`;

		// Retry original request with new token
		res = await fetch(`${API_URL}${path}`, {
			...options,
			headers: headersObj,
			credentials: "include",
		});
	}

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.error || `Request failed: ${res.status}`);
	}

	return (await res.json()) as Promise<T>;
}

/** Auth API */
export const authApi = {
	register: (data: { email: string; password: string; name?: string }) =>
		request("/auth/register", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	login: (data: { email: string; password: string }) =>
		request<{ id: number; email: string; name?: string; token?: string }>(
			"/auth/login",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		),
};
