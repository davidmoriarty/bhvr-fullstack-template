// client/src/lib/auth-submit.ts
import { authApi } from "@/lib/api";
import { type AuthSubmit, setAuthToken, useAuth } from "@/lib/auth";

type RegisterValues = {
	name: string;
	email: string;
	password: string;
};

type LoginValues = {
	email: string;
	password: string;
};

type LogoutValues = Record<string, unknown>;

export const submitRegister: AuthSubmit<RegisterValues> = async (values) => {
	type RegisterResponse = {
		id: number;
		name: string;
		email: string;
	};

	try {
		// Call backend register API
		const res = (await authApi.register({
			name: values.name.trim(),
			email: values.email.trim(),
			password: values.password.trim(),
		})) as RegisterResponse;

		// Store user only (token handled via /auth/refresh)
		useAuth.setState({
			user: {
				id: res.id,
				email: res.email,
				name: res.name,
			},
			token: null,
		});

		// Persist user locally
		localStorage.setItem(
			"auth",
			JSON.stringify({
				user: {
					id: res.id,
					email: res.email,
					name: res.name,
				},
				token: null,
			}),
		);

		// Automatically log in to ensure refresh token is set
		await useAuth.getState().login(values.email, values.password);

		return { ok: true };
	} catch (err: unknown) {
		if (err instanceof Error) return { ok: false, fieldError: err.message };
		return { ok: false, formError: "Registration failed" };
	}
};

export const submitLogin: AuthSubmit<LoginValues> = async (values) => {
	try {
		// Call backend login API
		const res = await authApi.login({
			email: values.email.trim(),
			password: values.password.trim(),
		});

		// IMPORTANT: persist token if provided
		const token = res.token ?? null;
		if (token) setAuthToken(token);

		// Update Zustand store
		useAuth.setState({
			user: {
				id: res.id,
				email: res.email,
				name: res.name,
			},
			token,
		});

		// Persist user + token locally
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
		return { ok: true };
	} catch (err: unknown) {
		console.log("submitLogin: caught error", err);
		if (err instanceof Error) return { ok: false, fieldError: err.message };
		return { ok: false, formError: "Login failed" };
	}
};

export const submitLogout: AuthSubmit<LogoutValues> = async () => {
	try {
		// Call store logout (clears state + localStorage + server cookie)
		await useAuth.getState().logout();
		return { ok: true };
	} catch (err: unknown) {
		// Narrow unknown to Error safely
		if (err instanceof Error) return { ok: false, fieldError: err.message };
		return { ok: false, formError: "Logout failed" };
	}
};
