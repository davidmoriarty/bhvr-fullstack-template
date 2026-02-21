// client/src/components/AuthLoader.tsx
import { type ReactNode, useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { useAuth } from "@/lib/auth";

export function AuthLoader({ children }: { children: ReactNode }) {
	const setToken = useAuth((state) => state.setToken);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		async function refresh() {
			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/refresh`,
					{
						method: "POST",
						credentials: "include",
					},
				);

				if (res.ok) {
					const data = await res.json();
					setToken(data.token);
				}
			} catch (err) {
				console.warn("Refresh token failed:", err);
				setToken(null);
			} finally {
				setReady(true);
			}
		}

		refresh();
	}, [setToken]);

	if (!ready)
		return (
			<Section centered>
				<Container className="max-w-2xl">
					<div className="p-4">Loading...</div>
				</Container>
			</Section>
		);

	return <>{children}</>;
}
