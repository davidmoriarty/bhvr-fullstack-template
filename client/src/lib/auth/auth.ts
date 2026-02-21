// client/src/lib/auth.ts
import { create } from "zustand";
import { authApi } from "@/lib/api";

type User = {
	id: number;
	email: string;
	name?: string;
};

type AuthState = {
	user: User | null;
	token: string | null;

	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setToken: (token: string | null) => void;
};

// Initialize store with localStorage persistence
export const useAuth = create<AuthState>((set) => {
	const stored = localStorage.getItem("auth");
	const parsed = stored ? JSON.parse(stored) : null;

	return {
		user: parsed?.user ?? null,
		token: parsed?.token ?? null,

		setToken(token) {
			set({ token });
			const current = localStorage.getItem("auth");
			const parsed = current ? JSON.parse(current) : {};
			localStorage.setItem(
				"auth",
				JSON.stringify({
					...parsed,
					token,
				}),
			);
		},

		async login(email: string, password: string) {
			const res = await authApi.login({ email, password });
			const token = res.token ?? null;
			if (token) setAuthToken(token);

			// Store user only
			set({
				user: {
					id: res.id,
					email: res.email,
					name: res.name,
				},
				token,
			});

			// Persist user only
			localStorage.setItem(
				"auth",
				JSON.stringify({
					user: {
						id: res.id,
						email: res.email,
						name: res.name,
					},
					token,
				}),
			);
		},

		async logout() {
			// clear client state immediately
			set({ user: null, token: null });
			localStorage.removeItem("auth");

			// best-effort server logout (don’t block UI)
			fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/logout`,
				{
					method: "POST",
					credentials: "include",
				},
			).catch(() => {
				console.warn("Failed to clear server refresh token");
			});
		},
	};
});

// Optional helper for direct token access
export function setAuthToken(token: string | null) {
	useAuth.setState({ token });
}
