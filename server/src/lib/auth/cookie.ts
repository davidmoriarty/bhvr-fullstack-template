// server/src/lib/auth/cookie.ts
export const REFRESH_EXPIRES_SECONDS = 60 * 60 * 24 * 30;

function baseOptions() {
	return {
		httpOnly: true,
		path: "/",
		sameSite: "None" as const,
		secure: true,
	};
}

export function getRefreshCookieOptions() {
	return {
		...baseOptions(),
		maxAge: REFRESH_EXPIRES_SECONDS,
		expires: new Date(Date.now() + REFRESH_EXPIRES_SECONDS * 1000),
	};
}

export function getExpiredRefreshCookieOptions() {
	return {
		...baseOptions(),
		maxAge: 0,
		expires: new Date(0),
	};
}
