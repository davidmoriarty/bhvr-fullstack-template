// client/src/lib/rpc.ts
import { hc } from "hono/client";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
	throw new Error("BASE_URL is not defined");
}

export const rpc = hc(BASE_URL, {
	fetch: (input: RequestInfo | URL, init?: RequestInit) =>
		fetch(input, {
			...init,
			credentials: "include",
		}),
});
